import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../index.css";

const Projects = () => {
  const navigate = useNavigate();
  const [projects, setProjects] = useState(
    JSON.parse(localStorage.getItem("projects")) || []
  );
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const user = JSON.parse(localStorage.getItem("user"));

  const addProject = () => {
    if (!title || !description) return alert("Fill all fields!");

    const newProject = {
      id: Date.now(),
      title,
      description,
      tasks: []
    };

    const updated = [...projects, newProject];
    setProjects(updated);
    localStorage.setItem("projects", JSON.stringify(updated));

    setTitle("");
    setDescription("");
  };
const openProject = (id) => {
  navigate(`/projects/${id}`);
};



  const logout = () => {
    localStorage.removeItem("user");
    navigate("/");
  };

  return (
    <div className="projects-ui">

      {/* Top Bar */}
      <div className="projects-header">
        <h2>📁 Projects</h2>
        <div>
          <span className="user-badge">👤 {user.username} ({user.role})</span>
          <button className="logout-btn" onClick={logout}>Logout</button>
        </div>
      </div>

      <div className="projects-grid">

        {/* Add Project */}
        {user.role === "manager" && (
          <div className="project-card add-project">
            <h3>➕ Create Project</h3>

            <input
              type="text"
              placeholder="Project Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />

            <textarea
              placeholder="Project Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />

            <button onClick={addProject}>Create</button>
          </div>
        )}

        {/* Project List */}
        {projects.map(p => (
  <div key={p.id} className="project-card" onClick={() => openProject(p.id)}>
    <h3>{p.title}</h3>
    <p>{p.description}</p>
  </div>
))}

      </div>
    </div>
  );
};

export default Projects;
