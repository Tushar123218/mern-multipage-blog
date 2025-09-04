import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../utils/api";
import { getUser } from "../utils/auth";

export default function EditBlog() {
  const { id } = useParams();
  const navigate = useNavigate();
  const user = getUser();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [pages, setPages] = useState([{ heading: "", content: "" }]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get(`/blogs/${id}`)
      .then(res => {
        const blog = res.data?.blog || res.blog || res.data;
        if (!blog) {
          alert("Blog not found!");
          return;
        }
        setTitle(blog.title || "");
        setDescription(blog.description || "");
        setPages(
          blog.pages && blog.pages.length
            ? blog.pages.map(p => ({
                heading: p.heading || "",
                content: p.content || "",
                _id: p._id,
              }))
            : [{ heading: "", content: "" }]
        );
        setLoading(false);
      })
      .catch(() => {
        alert("Failed to load blog!");
        setLoading(false);
      });
  }, [id]);

  const handlePageChange = (idx, field, value) => {
    setPages(pages =>
      pages.map((p, i) => (i === idx ? { ...p, [field]: value } : p))
    );
  };

  const handleAddPage = () => {
    setPages([...pages, { heading: "", content: "" }]);
  };

  const handleRemovePage = idx => {
    setPages(pages => pages.filter((_, i) => i !== idx));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    await API.put(`/blogs/${id}`, {
      title,
      description,
      pages,
      author: user._id || user.id, // send author for backend check
    });
    navigate("/");
  };

  if (loading)
    return (
      <div
        className="hello-kitty-bg"
        style={{
          minHeight: "80vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "2rem",
          color: "#ff69b4",
        }}
      >
        Loading...
      </div>
    );

  return (
    <form
      onSubmit={handleSubmit}
      className="blog-create-box"
      style={{ marginTop: 32 }}
    >
      <h2
        style={{
          color: "#ff69b4",
          fontFamily: "'Comic Sans MS', 'Comic Sans', cursive",
          textShadow: "1px 1px 0 #fff, 2px 2px 0 #ffb6e6",
          fontSize: "2.5rem",
          marginBottom: "32px",
        }}
      >
        Edit Blog
      </h2>
      <input
        className="input"
        style={{ marginBottom: 24, width: "100%" }}
        value={title}
        onChange={e => setTitle(e.target.value)}
        placeholder="Title"
        required
      />
      <textarea
        className="input"
        style={{ marginBottom: 24, width: "100%" }}
        value={description}
        onChange={e => setDescription(e.target.value)}
        placeholder="Short description (optional)"
        rows={3}
      />
      <h3
        style={{
          color: "#ff69b4",
          fontFamily: "'Comic Sans MS', 'Comic Sans', cursive",
          textShadow: "1px 1px 0 #fff, 2px 2px 0 #ffb6e6",
          marginBottom: 16,
        }}
      >
        Pages
      </h3>
      <div>
        {pages.map((page, idx) => (
          <div
            key={page._id || idx}
            style={{
              background: "#fff0fa",
              border: "2px solid #ffb6e6",
              borderRadius: 24,
              boxShadow: "0 4px 24px #ffb6e6aa",
              padding: 18,
              marginBottom: 24,
            }}
          >
            <input
              className="input"
              style={{ marginBottom: 12, width: "100%" }}
              value={page.heading}
              onChange={e => handlePageChange(idx, "heading", e.target.value)}
              placeholder="Page Heading"
              required
            />
            <textarea
              className="input"
              style={{ marginBottom: 12, width: "100%" }}
              value={page.content}
              onChange={e => handlePageChange(idx, "content", e.target.value)}
              placeholder="Page content"
              rows={4}
              required
            />
            {pages.length > 1 && (
              <button
                type="button"
                className="btn"
                style={{
                  background: "#ff69b4",
                  color: "#fff",
                  marginTop: 4,
                }}
                onClick={() => handleRemovePage(idx)}
              >
                Remove Page
              </button>
            )}
          </div>
        ))}
      </div>
      <button
        type="button"
        className="btn"
        style={{
          background: "#ff69b4",
          color: "#fff",
          marginRight: 16,
        }}
        onClick={handleAddPage}
      >
        Add Page
      </button>
      <button
        className="btn"
        style={{ background: "#ff69b4", color: "#fff" }}
        type="submit"
      >
        Update Blog
      </button>
    </form>
  );
}