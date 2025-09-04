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
      try {
        const res = await API.get(`/blogs/search/${query}`);
        setBlogs(res.blogs || []);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    })();
  }, [query]);

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <h2>Search Results for "{query}"</h2>
      {blogs.length === 0 ? (
        <div>No blogs found.</div>
      ) : (
        blogs.map((b) => <BlogCard key={b._id} blog={b} />)
      )}
    </div>
  );
}
