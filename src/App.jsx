import React from "react";
import { Routes, Route } from "react-router-dom";
import Login from "./Components/Login";
import ProjectsPage from "./Components/ProjectsPage";
import ProjectDetails from "./Components/ProjectDetails";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/projects" element={<ProjectsPage />} />
      <Route path="/projects/:id" element={<ProjectDetails />} />
    </Routes>
  );
}

export default App;
