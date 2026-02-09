import React from "react";
import ProjectDetails from "./ProjectDetails";

const Dashboard = ({ user }) => {
  const project = {
    id: 1,
    title: "Project Tracker App",
    description: "Professional task management system",
  };

  return (
    <div className="dashboard">
      <h2>📊 Dashboard</h2>
      <ProjectDetails project={project} user={user} />
    </div>
  );
};

export default Dashboard;
