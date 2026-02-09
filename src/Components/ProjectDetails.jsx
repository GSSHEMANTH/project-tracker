import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import users from "../data/users";
import "../index.css";

const ProjectDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user"));

  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [assignedTo, setAssignedTo] = useState("");
  const [search, setSearch] = useState("");

  // Load project + tasks
  useEffect(() => {
    const projects = JSON.parse(localStorage.getItem("projects")) || [];
    const foundProject = projects.find(p => p.id === Number(id));
    setProject(foundProject);

    const storedTasks = JSON.parse(localStorage.getItem("tasks")) || [];
    const projectTasks = storedTasks.filter(task => task.projectId === Number(id));
    setTasks(projectTasks);
  }, [id]);

  const saveTasks = (updatedTasks) => {
    const allTasks = JSON.parse(localStorage.getItem("tasks")) || [];
    const otherTasks = allTasks.filter(task => task.projectId !== Number(id));
    const finalTasks = [...otherTasks, ...updatedTasks];
    localStorage.setItem("tasks", JSON.stringify(finalTasks));
  };

  const addTask = () => {
    if (!title || !assignedTo) {
      alert("Enter title and assign user!");
      return;
    }

    const newTask = {
      id: Date.now(),
      projectId: Number(id),
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

  const updateStatus = (taskId, status) => {
    const updatedTasks = tasks.map(task =>
      task.id === taskId ? { ...task, status } : task
    );
    setTasks(updatedTasks);
    saveTasks(updatedTasks);
  };

  const deleteTask = (taskId) => {
    const updatedTasks = tasks.filter(task => task.id !== taskId);
    setTasks(updatedTasks);
    saveTasks(updatedTasks);
  };

  const filteredTasks =
    user.role === "manager"
      ? tasks
      : tasks.filter(task => task.assignedTo === user.username);

  const searchedTasks = filteredTasks.filter(task =>
    task.title.toLowerCase().includes(search.toLowerCase())
  );

  if (!project) return <h2>Loading project...</h2>;

  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(t => t.status === "completed").length;
  const pendingTasks = totalTasks - completedTasks;

  return (
    <div className="project-ui">

      <div className="project-header">
        <button onClick={() => navigate("/projects")} className="back-btn">← Back</button>
        <div>
          <h2>{project.title}</h2>
          <p>{project.description}</p>
        </div>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <h3>{totalTasks}</h3>
          <p>Total Tasks</p>
        </div>
        <div className="stat-card">
          <h3>{completedTasks}</h3>
          <p>Completed</p>
        </div>
        <div className="stat-card">
          <h3>{pendingTasks}</h3>
          <p>Pending</p>
        </div>
      </div>

      <div className="project-grid">

        {user.role === "manager" && (
          <div className="card">
            <h3>➕ Add Task</h3>

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

            <select value={assignedTo} onChange={(e) => setAssignedTo(e.target.value)}>
              <option value="">Assign User</option>
              {users.filter(u => u.role === "member").map(u => (
                <option key={u.id} value={u.username}>{u.username}</option>
              ))}
            </select>

            <button className="primary-btn" onClick={addTask}>Add Task</button>
          </div>
        )}

        <div className="card">
          <div className="task-header">
            <h3>📋 Tasks</h3>
            <input
              type="text"
              placeholder="Search..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {searchedTasks.length === 0 && <p>No tasks found.</p>}

          {searchedTasks.map(task => (
            <div key={task.id} className="task-row">
              <div>
                <h4>{task.title}</h4>
                <p>{task.description}</p>
                <span>👤 {task.assignedTo}</span>
              </div>

              <div className="task-actions">
                <select
                  value={task.status}
                  onChange={(e) => updateStatus(task.id, e.target.value)}
                >
                  <option value="pending">Pending</option>
                  <option value="in-progress">In Progress</option>
                  <option value="completed">Completed</option>
                </select>

                {user.role === "manager" && (
                  <button className="danger-btn" onClick={() => deleteTask(task.id)}>✕</button>
                )}
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};

export default ProjectDetails;