import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import users from "../data/users";
import "../index.css";

const ProjectDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [assignedTo, setAssignedTo] = useState("");
  const [search, setSearch] = useState("");

  const user = JSON.parse(localStorage.getItem("user"));

  // ✅ Load project + tasks
  useEffect(() => {
    const projects = JSON.parse(localStorage.getItem("projects")) || [];
    const currentProject = projects.find((p) => String(p.id) === String(id));
    setProject(currentProject);

    const storedTasks = JSON.parse(localStorage.getItem("tasks")) || [];
    const projectTasks = storedTasks.filter(
      (task) => String(task.projectId) === String(id)
    );
    setTasks(projectTasks);
  }, [id]);

  // ✅ Save tasks
  const saveTasks = (updatedTasks) => {
    const allTasks = JSON.parse(localStorage.getItem("tasks")) || [];
    const otherTasks = allTasks.filter(
      (task) => String(task.projectId) !== String(id)
    );
    const finalTasks = [...otherTasks, ...updatedTasks];
    localStorage.setItem("tasks", JSON.stringify(finalTasks));
  };

  // ✅ Add task
  const addTask = () => {
    if (!title || !assignedTo) {
      alert("Fill all fields!");
      return;
    }

    const newTask = {
      id: Date.now(),
      projectId: id,
      title,
      description,
      assignedTo,
      status: "pending",
    };

    const updatedTasks = [...tasks, newTask];
    setTasks(updatedTasks);
    saveTasks(updatedTasks);

    setTitle("");
    setDescription("");
    setAssignedTo("");
  };

  // ✅ Update status
  const updateStatus = (taskId, status) => {
    const updatedTasks = tasks.map((task) =>
      task.id === taskId ? { ...task, status } : task
    );
    setTasks(updatedTasks);
    saveTasks(updatedTasks);
  };

  // ✅ Delete task
  const deleteTask = (taskId) => {
    const updatedTasks = tasks.filter((task) => task.id !== taskId);
    setTasks(updatedTasks);
    saveTasks(updatedTasks);
  };

  if (!project) return <h2>Project not found ❌</h2>;

  // ✅ Stats
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((t) => t.status === "completed").length;
  const pendingTasks = totalTasks - completedTasks;

  // ✅ Role-based tasks
  const visibleTasks =
    user.role === "manager"
      ? tasks
      : tasks.filter((t) => t.assignedTo === user.username);

  // ✅ Search
  const filteredTasks = visibleTasks.filter((t) =>
    t.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="project-details-page">

      {/* 🔷 TOP BAR */}
      <div className="project-topbar">
        <button className="back-btn" onClick={() => navigate("/projects")}>
          ← Back
        </button>

        <h2>{project.title}</h2>

        <div className="top-user">
          👤 {user.username} ({user.role})
        </div>
      </div>

      {/* 🔷 STATS */}
      <div className="project-stats">
        <div className="stat-box">Total: {totalTasks}</div>
        <div className="stat-box completed">Completed: {completedTasks}</div>
        <div className="stat-box pending">Pending: {pendingTasks}</div>
      </div>

      {/* 🔷 MAIN LAYOUT */}
      <div className="project-layout">

        {/* 🟦 LEFT PANEL */}
        <div className="left-panel">

          {/* ADD TASK (MANAGER ONLY) */}
          {user.role === "manager" && (
            <div className="add-task-box">
              <h3>Add Task</h3>

              <input
                type="text"
                placeholder="Task Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />

              <textarea
                placeholder="Task Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />

              <select
                value={assignedTo}
                onChange={(e) => setAssignedTo(e.target.value)}
              >
                <option value="">Assign User</option>
                {users
                  .filter((u) => u.role === "member")
                  .map((u) => (
                    <option key={u.id} value={u.username}>
                      {u.username}
                    </option>
                  ))}
              </select>

              <button onClick={addTask}>Add Task</button>
            </div>
          )}

          {/* TASK LIST */}
          <div className="task-list-box">
            <h3>Tasks</h3>

            <div className="task-scroll">
              {filteredTasks.map((task) => (
                <div key={task.id} className="task-card-ui">

                  <div className="task-left">
                    <h4>{task.title}</h4>
                    <p>{task.description}</p>
                    <span>👤 {task.assignedTo}</span>
                  </div>

                  <div className="task-right">
                    <select
                      className="task-status"
                      value={task.status}
                      onChange={(e) =>
                        updateStatus(task.id, e.target.value)
                      }
                    >
                      <option value="pending">Pending</option>
                      <option value="completed">Completed</option>
                    </select>

                    {user.role === "manager" && (
                      <button
                        className="task-delete"
                        onClick={() => deleteTask(task.id)}
                      >
                        ✕
                      </button>
                    )}
                  </div>

                </div>
              ))}
            </div>
          </div>

        </div>

        {/* 🟧 RIGHT PANEL (SEARCH) */}
        <div className="right-panel">
          <h3>Search Tasks</h3>

          <input
            type="text"
            placeholder="Search task..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <div className="search-results">
            {filteredTasks.map((task) => (
              <div key={task.id} className="search-item">
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
