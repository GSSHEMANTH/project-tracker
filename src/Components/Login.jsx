import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import users from "../data/users";
import "../index.css";

const Login = () => {
  const [role, setRole] = useState("");
  const [username, setUsername] = useState("");
  const navigate = useNavigate();

  const filteredUsers = role ? users.filter(u => u.role === role) : [];

  const handleLogin = () => {
    const user = users.find(u => u.username === username && u.role === role);

    if (!user) {
      alert("Invalid user!");
      return;
    }

    localStorage.setItem("user", JSON.stringify(user));
    navigate("/projects");
  };

  return (
    <div className="login-container">
      <div className="login-card">

        <h2>Project Management System</h2>
        <p>Login to continue</p>

        <select value={role} onChange={(e) => setRole(e.target.value)}>
          <option value="">Select Role</option>
          <option value="manager">Manager</option>
          <option value="member">Member</option>
        </select>

        <select
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          disabled={!role}
        >
          <option value="">Select User</option>
          {filteredUsers.map(u => (
            <option key={u.id} value={u.username}>{u.username}</option>
          ))}
        </select>

        <button onClick={handleLogin}>Login</button>

      </div>
    </div>
  );
};

export default Login;
