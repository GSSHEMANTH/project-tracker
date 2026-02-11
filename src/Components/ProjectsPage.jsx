import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../index.css";

const ProjectsPage = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  const [projects, setProjects] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    if (!user) navigate("/");
    const storedProjects = JSON.parse(localStorage.getItem("projects")) || [];
    setProjects(storedProjects);
  }, [navigate, user]);

  const addProject = () => {
    if (!title || !description) {
      alert("Enter project title and description");
      return;
    }

    const newProject = {
      id: Date.now(),
      title,
      description,
      createdBy: user.username,
    };

    const updatedProjects = [...projects, newProject];
    setProjects(updatedProjects);
    localStorage.setItem("projects", JSON.stringify(updatedProjects));

    setTitle("");
    setDescription("");
  };

  const logout = () => {
    localStorage.removeItem("user");
    navigate("/");
  };

  return (
    <div className="projects-page">

      {/* 🔝 Top Bar */}
      <div className="top-bar">
        <h2>📁 Project Tracker</h2>
        <div className="top-bar-right">
          <span>👤 {user?.username}</span>
          <button className="logout-btn" onClick={logout}>Logout</button>
        </div>
      </div>

      {/* ➕ Add Project Section */}
      {user?.role === "manager" && (
        <div className="add-project-card">
          <h3>Add New Project</h3>

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

          <button className="primary-btn" onClick={addProject}>
            Add Project
          </button>
        </div>
      )}

      {/* 📋 Projects List */}
      <div className="projects-list">
        <h3>All Projects</h3>

        <div className="projects-grid">
          {projects.map((project) => (
            <div
              key={project.id}
              className="project-card"
              onClick={() => navigate(`/project/${project.id}`)}
            >
              <h4>{project.title}</h4>
              <p>{project.description}</p>
              <span>Created by: {project.createdBy}</span>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};

export default ProjectsPage;
