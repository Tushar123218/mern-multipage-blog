import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import API from "../utils/api";
import BlogCard from "../components/BlogCard";

export default function SearchResults() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  const query = new URLSearchParams(location.search).get("q");

  useEffect(() => {
    (async () => {
      if (!query) return setLoading(false);
      try {
        // ✅ Updated API endpoint with /api prefix
        const res = await API.get(`/api/blogs/search/${query}`);
        setBlogs(res.blogs || res.data?.blogs || []);
      } catch (e) {
        console.error("Error fetching search results:", e);
        setBlogs([]);
      } finally {
        setLoading(false);
      }
    })();
  }, [query]);

  if (loading) return <div>Loading...</div>;

  return (
    <div style={{ padding: "16px" }}>
      <h2>Search Results for "{query}"</h2>
      {blogs.length === 0 ? (
        <div>No blogs found.</div>
      ) : (
        <div className="blog-list">
          {blogs.map((b) => (
            <BlogCard key={b._id} blog={b} />
          ))}
        </div>
      )}
    </div>
  );
}
