import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "../index.css";

const ProjectDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [members, setMembers] = useState([]);
  const [search, setSearch] = useState("");

  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    assignedTo: "",
    status: "pending"
  });

  const user = JSON.parse(localStorage.getItem("user"));
  const taskRefs = useRef({});

  /* ===============================
     LOAD PROJECT + USERS
  =============================== */
  useEffect(() => {
    const storedProjects =
      JSON.parse(localStorage.getItem("projects")) || [];

    const foundProject = storedProjects.find(
      (p) => String(p.id) === String(id)
    );

    if (!foundProject) {
      navigate("/projects");
      return;
    }

    setProject(foundProject);
    setTasks(foundProject.tasks || []);

    const storedUsers =
  JSON.parse(localStorage.getItem("users")) || [];

const onlyMembers = storedUsers.filter(
  (u) => u.role === "member"
);
    setMembers(onlyMembers);

  }, [id, navigate]);

  /* ===============================
     SAVE PROJECT TO LOCAL STORAGE
  =============================== */
  const updateProjectStorage = (updatedTasks) => {
    const allProjects =
      JSON.parse(localStorage.getItem("projects")) || [];

    const updatedProjects = allProjects.map((p) =>
      String(p.id) === String(id)
        ? { ...p, tasks: updatedTasks }
        : p
    );

    localStorage.setItem(
      "projects",
      JSON.stringify(updatedProjects)
    );

    setTasks(updatedTasks);
  };

  /* ===============================
     ADD TASK
  =============================== */
  const addTask = () => {
    if (!newTask.title || !newTask.assignedTo) {
      alert("Please fill all fields");
      return;
    }

    const task = {
      id: Date.now(),
      ...newTask
    };

    const updatedTasks = [...tasks, task];
    updateProjectStorage(updatedTasks);

    setNewTask({
      title: "",
      description: "",
      assignedTo: "",
      status: "pending"
    });
  };

  /* ===============================
     UPDATE STATUS
  =============================== */
  const updateStatus = (taskId, status) => {
    const updatedTasks = tasks.map((t) =>
      t.id === taskId ? { ...t, status } : t
    );

    updateProjectStorage(updatedTasks);
  };

  /* ===============================
     DELETE TASK
  =============================== */
  const deleteTask = (taskId) => {
    const updatedTasks = tasks.filter(
      (t) => t.id !== taskId
    );

    updateProjectStorage(updatedTasks);
  };

  /* ===============================
     ROLE FILTER
  =============================== */
  const visibleTasks =
    user?.role === "manager"
      ? tasks
      : tasks.filter(
          (t) => t.assignedTo === user?.username
        );

  /* ===============================
     SEARCH FILTER
  =============================== */
  const filteredTasks = visibleTasks.filter((t) =>
    t.title.toLowerCase().includes(search.toLowerCase())
  );

  /* ===============================
     SCROLL TO TASK
  =============================== */
  const scrollToTask = (taskId) => {
    const element = taskRefs.current[taskId];
    if (element) {
      element.scrollIntoView({
        behavior: "smooth",
        block: "center"
      });
    }
  };

  /* ===============================
     STATS
  =============================== */
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(
    (t) => t.status === "completed"
  ).length;
  const pendingTasks = totalTasks - completedTasks;

  if (!project) return null;

  return (
    <div className="project-details-page">

      {/* TOP BAR */}
      <div className="project-topbar">
        <button
          onClick={() => navigate("/projects")}
          className="back-btn"
        >
          ← Back
        </button>

        <h2>{project.title}</h2>

        <span className="user-info">
          👤 {user?.username} ({user?.role})
        </span>
      </div>

      {/* STATS */}
      <div className="project-stats">
        <div className="stat-box">Total: {totalTasks}</div>
        <div className="stat-box">Completed: {completedTasks}</div>
        <div className="stat-box">Pending: {pendingTasks}</div>
      </div>

      {/* MAIN LAYOUT */}
      <div className="project-layout">

        {/* LEFT PANEL */}
        <div className="left-panel">

          {/* ADD TASK (Manager Only) */}
          {user?.role === "manager" && (
            <div className="add-task-box">
              <h3>Add Task</h3>

              <input
                type="text"
                placeholder="Task Title"
                value={newTask.title}
                onChange={(e) =>
                  setNewTask({
                    ...newTask,
                    title: e.target.value
                  })
                }
              />

              <textarea
                placeholder="Task Description"
                value={newTask.description}
                onChange={(e) =>
                  setNewTask({
                    ...newTask,
                    description: e.target.value
                  })
                }
              />

              {/* ASSIGN DROPDOWN */}
              <select
                value={newTask.assignedTo}
                onChange={(e) =>
                  setNewTask({
                    ...newTask,
                    assignedTo: e.target.value
                  })
                }
              >
                <option value="">Select Member</option>

                {members.length === 0 ? (
                  <option disabled>No members found</option>
                ) : (
                  members.map((m) => (
                    <option
                      key={m.id}
                      value={m.username}
                    >
                      {m.username}
                    </option>
                  ))
                )}
              </select>

              <button
                className="primary-btn"
                onClick={addTask}
              >
                Add Task
              </button>
            </div>
          )}

          {/* TASK LIST */}
          <div className="task-list-box">
            <h3>Tasks</h3>

            <div className="task-scroll">
              {filteredTasks.map((task) => (
                <div
                  key={task.id}
                  ref={(el) =>
                    (taskRefs.current[task.id] = el)
                  }
                  className="task-card"
                >
                  <h4>{task.title}</h4>
                  <p>{task.description}</p>
                  <span>👤 {task.assignedTo}</span>

                  <select
                    value={task.status}
                    onChange={(e) =>
                      updateStatus(
                        task.id,
                        e.target.value
                      )
                    }
                  >
                    <option value="pending">
                      Pending
                    </option>
                    <option value="in-progress">
                      In Progress
                    </option>
                    <option value="completed">
                      Completed
                    </option>
                  </select>

                  {user?.role === "manager" && (
                    <button
                      className="danger-btn"
                      onClick={() =>
                        deleteTask(task.id)
                      }
                    >
                      Remove
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* RIGHT PANEL */}
        <div className="right-panel">
          <h3>Search Tasks</h3>

          <input
            type="text"
            placeholder="Search task..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
          />

          <div className="search-results">
            {filteredTasks.map((task) => (
              <div
                key={task.id}
                className="search-item"
                onClick={() =>
                  scrollToTask(task.id)
                }
              >
                {task.title}
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};

export default ProjectDetails;