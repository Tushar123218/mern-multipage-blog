import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../utils/api";
import { saveAuth } from "../utils/auth";

export default function Register() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    setErr("");
    try {
      // ✅ Updated API endpoint with /api prefix
      const data = await API.post("/api/auth/register", { username, email, password });

      // expected response: { token, user }
      saveAuth(data.token, data.user);
      navigate("/");
    } catch (e) {
      // normalize error message
      setErr(e.message || e.payload?.message || "Register failed");
    }
  };

  return (
    <div style={{ display: "flex", justifyContent: "center" }}>
      <form className="card" onSubmit={submit} style={{ width: 420, padding: 20, borderRadius: 20 }}>
        <h2 className="center">Register</h2>
        {err && <div style={{ color: "red", marginBottom: 12 }}>{err}</div>}

        <input
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          style={{ marginBottom: 12 }}
          required
        />
        <input
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{ marginBottom: 12 }}
          required
        />
        <input
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          type="password"
          style={{ marginBottom: 12 }}
          required
        />

        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          <button
            type="submit"
            style={{
              background: "#10b981",
              color: "white",
              borderRadius: 12,
              padding: "8px 20px",
              border: "none",
            }}
          >
            Register
          </button>
        </div>
      </form>
    </div>
  );
}
