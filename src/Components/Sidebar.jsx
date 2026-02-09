import React from "react";

const Sidebar = ({ user, logout }) => {
  return (
    <div className="sidebar">
      <h2>🚀 TaskFlow</h2>

      <div className="user-box">
        <p>{user.username}</p>
        <span>{user.role}</span>
      </div>

      <button className="logout-btn" onClick={logout}>
        Logout
      </button>
    </div>
  );
};

export default Sidebar;
