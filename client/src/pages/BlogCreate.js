import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../utils/api";
import { getUser } from "../utils/auth";

export default function BlogCreate() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [pages, setPages] = useState([{ heading: "", content: "" }]);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState(null);
  const navigate = useNavigate();
  const user = getUser(); // logged-in user from localStorage

  const addPage = () => setPages(p => [...p, { heading: "", content: "" }]);

  const updatePage = (idx, key, value) => {
    setPages(p => p.map((pg, i) => (i === idx ? { ...pg, [key]: value } : pg)));
  };

  const create = async (e) => {
    e.preventDefault();
    setErr(null);

    if (!title.trim()) return setErr("Title required");
    if (!(user?._id || user?.id)) return setErr("You must be logged in to create a blog");

    setLoading(true);
    try {
      const payload = {
        title,
        description,
        author: user._id || user.id, // always use _id
        pages
      };

      // ✅ Fixed API call: added /api prefix
      const res = await API.post("/api/blogs", payload);

      // Navigate to created blog page
      navigate(`/blog/${res.blog._id}`);
    } catch (e) {
      setErr(e.message || "Failed to create");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>Create Blog</h2>
      <form className="card" onSubmit={create} style={{ display: "grid", gap: 12 }}>
        {err && <div style={{ color: "red" }}>{err}</div>}

        <input
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <textarea
          placeholder="Short description (optional)"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <h4>Pages</h4>
        {pages.map((pg, idx) => (
          <div key={idx} className="card">
            <input
              placeholder="Page Heading"
              value={pg.heading}
              onChange={(e) => updatePage(idx, "heading", e.target.value)}
            />
            <textarea
              placeholder="Page content"
              value={pg.content}
              onChange={(e) => updatePage(idx, "content", e.target.value)}
            />
          </div>
        ))}

        <div style={{ display: "flex", gap: 8 }}>
          <button
            type="button"
            onClick={addPage}
            style={{ background: "#e5e7eb" }}
          >
            Add Page
          </button>

          <button
            type="submit"
            style={{ background: "#10b981", color: "white" }}
            disabled={loading}
          >
            {loading ? "Creating..." : "Create Blog"}
          </button>
        </div>
      </form>
    </div>
  );
}
