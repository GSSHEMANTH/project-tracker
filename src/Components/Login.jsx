import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import usersData from "../data/users";
import "../index.css";

const Login = () => {
  const navigate = useNavigate();

  const [role, setRole] = useState("");
  const [username, setUsername] = useState("");

  // ✅ If already logged in → go to projects
  useEffect(() => {
    const existingUser = JSON.parse(localStorage.getItem("user"));
    if (existingUser) {
      navigate("/projects");
    }
  }, [navigate]);

  // ✅ Filter users based on selected role
  const filteredUsers = role
    ? usersData.filter((u) => u.role === role)
    : [];

  const handleLogin = () => {
    if (!role || !username) {
      alert("Please select role and user");
      return;
    }

    const user = usersData.find(
      (u) => u.username === username && u.role === role
    );

    if (!user) {
      alert("Invalid login");
      return;
    }

    // ✅ Save full users list (for task assignment dropdown)
    localStorage.setItem("users", JSON.stringify(usersData));

    // ✅ Save logged user
    localStorage.setItem("user", JSON.stringify(user));

    navigate("/projects");
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h2>Project Management System</h2>
        <p>Login to continue</p>

        {/* Role Select */}
        <select
          value={role}
          onChange={(e) => {
            setRole(e.target.value);
            setUsername(""); // reset username when role changes
          }}
        >
          <option value="">Select Role</option>
          <option value="manager">Manager</option>
          <option value="member">Member</option>
        </select>

        {/* Username Select */}
        <select
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          disabled={!role}
        >
          <option value="">Select User</option>
          {filteredUsers.map((u) => (
            <option key={u.id} value={u.username}>
              {u.username}
            </option>
          ))}
        </select>

        <button className="primary-btn" onClick={handleLogin}>
          Login
        </button>
      </div>
    </div>
  );
};

export default Login;