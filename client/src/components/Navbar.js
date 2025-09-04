import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { getUser, clearAuth } from "../utils/auth";

export default function Navbar({ onSearch }) {
  const user = getUser();
  const navigate = useNavigate();
  const [query, setQuery] = React.useState("");

  const onLogout = () => {
    clearAuth();
    navigate("/login");
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/search?q=${encodeURIComponent(query)}`);
      if (onSearch) onSearch(query.trim());
      setQuery("");
    }
  };

  return (
    <header className="navbar">
      <div style={{ display: "flex", alignItems: "center" }}>
        <Link to="/" style={{ fontWeight: 700, fontSize: 18, color: "white" }}>
          MyBlog
        </Link>
      </div>
      <nav>
        <Link to="/">Home</Link> {" | "}
        <Link to="/create">Create</Link> {" | "}
        <Link to="/profile">Profile</Link>
        {!user ? (
          <>
            {" | "}
            <Link to="/login">Login</Link> {" | "}
            <Link to="/register">Register</Link>
          </>
        ) : (
          <>
            {" | "}
            <span style={{ marginLeft: 8 }}>Hi, {user.username}</span>
            <button
              onClick={onLogout}
              style={{
                marginLeft: 10,
                background: "#ef4444",
                color: "white",
                padding: "6px 10px",
                borderRadius: 6,
              }}
            >
              Logout
            </button>
          </>
        )}
      </nav>

      {/* Search bar */}
      <form
        onSubmit={handleSearch}
        style={{ marginLeft: 24, display: "inline-block" }}
      >
        <input
          type="text"
          placeholder="Search blogs..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          style={{
            borderRadius: 16,
            border: "1px solid #ffb6e6",
            padding: "6px 12px",
            marginRight: 8,
            fontFamily: "inherit",
          }}
        />
        <button className="btn" style={{ background: "#ff69b4", color: "#fff" }}>
          Search
        </button>
      </form>
    </header>
  );
}
