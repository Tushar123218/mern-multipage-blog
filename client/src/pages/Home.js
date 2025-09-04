import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../utils/api";
import BlogCard from "../components/BlogCard";

export default function Home({ searchQuery = "" }) {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      try {
        // ✅ Updated API call with /api prefix
        const response = await API.get("/api/blogs");
        const blogList = response.blogs || response.blog || [];
        setBlogs(blogList);
      } catch (e) {
        console.error("Error fetching blogs:", e);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const handleDelete = async (blogId) => {
    if (window.confirm("Are you sure you want to delete this blog?")) {
      try {
        await API.del(`/api/blogs/${blogId}`);
        setBlogs((prev) => prev.filter((b) => b._id !== blogId));
      } catch (e) {
        console.error("Error deleting blog:", e);
      }
    }
  };

  const handleEdit = (blog) => {
    navigate(`/edit/${blog._id}`, { state: { blog } });
  };

  // Filter blogs by title, description, or author (case-insensitive)
  const filteredBlogs = blogs.filter(b => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return true;
    return (
      b.title?.toLowerCase().includes(q) ||
      b.description?.toLowerCase().includes(q) ||
      b.author?.username?.toLowerCase().includes(q)
    );
  });

  if (loading) return <div>Loading blogs...</div>;
  if (!filteredBlogs.length) return <div>No blogs found</div>;

  return (
    <div
      className="hello-kitty-bg"
      style={{ minHeight: "100vh", padding: "32px 0" }}
    >
      <h2>Latest Blogs</h2>
      <div className="blog-list">
        {filteredBlogs.map((b) => (
          <BlogCard
            key={b._id}
            blog={b}
            onDelete={handleDelete}
            onEdit={handleEdit}
          />
        ))}
      </div>
    </div>
  );
}
