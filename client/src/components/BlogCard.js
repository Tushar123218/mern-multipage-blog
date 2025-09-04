import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../utils/api";
import { getUser } from "../utils/auth";

function CommentThread({ comments, parentId = null, depth = 0 }) {
  return (
    <div style={{ marginLeft: depth * 15 }}>
      {comments
        .filter((c) => (c.parent ? c.parent === parentId : parentId === null))
        .map((c, idx) => (
          <div key={c._id || idx} style={{ marginBottom: 6 }}>
            <div className="small">
              {c.user?.username || "User"} •{" "}
              {new Date(c.createdAt).toLocaleDateString()}
            </div>
            <div>{c.text}</div>
            <CommentThread comments={comments} parentId={c._id} depth={depth + 1} />
          </div>
        ))}
    </div>
  );
}

export default function BlogCard({ blog }) {
  const user = getUser();
  const [likes, setLikes] = useState(blog.likes?.length || 0);
  const navigate = useNavigate();

  const isAuthor =
    user &&
    (user._id === blog.author?._id ||
      user._id === blog.author?.id ||
      user.id === blog.author?._id ||
      user.id === blog.author?.id);

  const like = async () => {
    try {
      if (!user) return alert("Login to like");
      // ✅ Updated API endpoint
      await API.post(`/api/blogs/${blog._id}/like`, { userId: user._id || user.id });
      setLikes((prev) => prev + 1);
    } catch (e) {
      console.error("Error liking blog:", e);
    }
  };

  const handleDelete = async () => {
    if (!user) return alert("Login to delete");
    if (!isAuthor) return alert("Not authorized");

    if (window.confirm("Are you sure you want to delete this blog?")) {
      try {
        // ✅ Updated API endpoint with userId query param
        await API.del(`/api/blogs/${blog._id}?userId=${user._id || user.id}`);
        alert("Blog deleted");
        window.location.reload(); // Or call a refresh function
      } catch (e) {
        console.error("Error deleting blog:", e);
        alert("Failed to delete blog");
      }
    }
  };

  const handleEdit = () => {
    if (!user) return alert("Login to edit");
    if (!isAuthor) return alert("Not authorized");

    navigate(`/blog/${blog._id}/edit`);
  };

  const previewComments = blog.comments || [];

  return (
    <div className="card" style={{ marginBottom: 16 }}>
      <h3 style={{ margin: 0 }}>{blog.title}</h3>
      <p className="small" style={{ marginTop: 6, marginBottom: 8 }}>
        by {blog.author?.username || "Unknown"} •{" "}
        {new Date(blog.createdAt).toLocaleString()}
      </p>

      <p style={{ marginBottom: 8 }}>
        {blog.description ||
          (blog.pages?.[0]?.content?.slice(0, 120) + "...")}
      </p>

      <div style={{ display: "flex", gap: 12, marginBottom: 10 }}>
        <button className="btn" onClick={like}>
          👍 Like ({likes})
        </button>
        <Link
          className="btn"
          style={{ background: "#fff0fa", color: "#ff69b4" }}
          to={`/blog/${blog._id}`}
        >
          Read Full Blog
        </Link>
        {isAuthor && (
          <>
            <button
              className="btn"
              style={{ background: "#ffb6e6", color: "#1a1a1a" }}
              onClick={handleEdit}
            >
              ✏️ Edit
            </button>
            <button
              className="btn"
              style={{ background: "#ff69b4", color: "#fff" }}
              onClick={handleDelete}
            >
              🗑️ Delete
            </button>
          </>
        )}
      </div>

      <div
        className="comments-section"
        style={{ background: "#fff8fc", padding: 8, borderRadius: 6 }}
      >
        <strong>Comments</strong>
        {previewComments.length ? (
          <CommentThread comments={previewComments} />
        ) : (
          <div className="small">No comments yet</div>
        )}
      </div>
    </div>
  );
}
