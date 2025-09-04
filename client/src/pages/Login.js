import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../utils/api";
import { saveAuth } from "../utils/auth";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    setErr("");
    try {
      const data = await API.post("/auth/login", { email, password });

      // expected: { token, user }
      saveAuth(data.token, data.user);
      navigate("/");
    } catch (e) {
      setErr(e.message || "Login failed");
    }
  };

  return (
    <div style={{ display: "flex", justifyContent: "center" }}>
      <form
        className="card"
        onSubmit={submit}
        style={{
          width: 420,
          padding: 20,
          borderRadius: 20,
          background: "#fff0f6",
          boxShadow: "0 4px 12px rgba(255, 182, 193, 0.4)",
        }}
      >
        <h2 style={{ textAlign: "center", color: "#ff4da6" }}>Login</h2>
        {err && <div style={{ color: "red" }}>{err}</div>}

        <input
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{ marginBottom: 12 }}
        />
        <input
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          type="password"
          style={{ marginBottom: 12 }}
        />

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <button
            type="submit"
            style={{
              background: "#2563eb",
              color: "white",
              borderRadius: 20,
              padding: "8px 20px",
              border: "none",
            }}
          >
            Login
          </button>

          {/* 🌸 Register Button */}
          <Link
            to="/register"
            style={{
              background: "#ff66b2",
              color: "white",
              borderRadius: 20,
              padding: "8px 16px",
              textDecoration: "none",
              boxShadow: "0 3px 6px rgba(255,105,180,0.3)",
              transition: "0.2s",
            }}
            onMouseEnter={(e) => (e.target.style.background = "#ff4da6")}
            onMouseLeave={(e) => (e.target.style.background = "#ff66b2")}
          >
            Register
          </Link>
        </div>
      </form>
    </div>
  );
}
