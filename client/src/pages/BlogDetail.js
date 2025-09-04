import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API from "../utils/api";
import { getUser } from "../utils/auth";

export default function BlogDetail() {
  const { id } = useParams();
  const [blog, setBlog] = useState(null);
  const [pageIndex, setPageIndex] = useState(0);
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState("");
  const [replyTo, setReplyTo] = useState(null); // 👈 track reply target
  const [loading, setLoading] = useState(true);
  const user = getUser();

  useEffect(() => {
    (async () => {
      try {
        const blogData = await API.get(`/blogs/${id}`);
        setBlog(blogData.blog || blogData);

        const commentData = await API.get(`/comments/${id}`);
        setComments(commentData);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  const like = async () => {
    try {
      await API.post(`/blogs/${id}/like`, { userId: user?.id || user?._id });
      const updated = await API.get(`/blogs/${id}`);
      setBlog(updated.blog || updated);
    } catch (e) {
      console.error(e);
    }
  };

  const postComment = async () => {
    if (!commentText.trim()) return;
    try {
      await API.post("/comments", {
        blogId: id,
        userId: user?.id || user?._id,
        text: commentText,
        parent: replyTo, // 👈 support reply
      });
      const updated = await API.get(`/comments/${id}`);
      setComments(updated);
      setCommentText("");
      setReplyTo(null);
    } catch (e) {
      console.error(e);
    }
  };

  const shareCopy = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      alert("Link copied to clipboard!");
    } catch {
      alert("Copy failed — manually copy the URL.");
    }
  };

  // 🔹 helper: convert flat list into nested comments
  const nestComments = (list) => {
    const map = {};
    const roots = [];
    list.forEach((c) => (map[c._id] = { ...c, replies: [] }));
    list.forEach((c) => {
      if (c.parent) {
        map[c.parent]?.replies.push(map[c._id]);
      } else {
        roots.push(map[c._id]);
      }
    });
    return roots;
  };

  const renderComments = (list, depth = 0) =>
    list.map((c) => (
      <div key={c._id} style={{ marginLeft: depth * 20, marginTop: 8 }}>
        <div className="small">
          {c.user?.username || "User"} •{" "}
          {new Date(c.createdAt).toLocaleString()}
        </div>
        <div>{c.text}</div>
        {user && (
          <button
            style={{ fontSize: "0.8em", marginTop: 4 }}
            onClick={() => setReplyTo(c._id)}
          >
            Reply
          </button>
        )}
        {c.replies?.length > 0 && renderComments(c.replies, depth + 1)}
      </div>
    ));

  if (loading) return <div className="card">Loading...</div>;
  if (!blog) return <div className="card">Blog not found</div>;

  const pages = blog.pages || [];
  const current = pages[pageIndex];

  return (
    <div>
      <h1>{blog.title}</h1>
      <p className="small">
        by {blog.author?.username || "Unknown"} •{" "}
        {new Date(blog.createdAt).toLocaleString()}
      </p>

      <div className="card" style={{ marginTop: 12 }}>
        <h3>{current?.heading || `Page ${pageIndex + 1}`}</h3>
        <div style={{ marginTop: 8 }}>
          <div dangerouslySetInnerHTML={{ __html: current?.content || "" }} />
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginTop: 12,
          }}
        >
          <div>
            <button
              onClick={() => setPageIndex((i) => Math.max(0, i - 1))}
              disabled={pageIndex === 0}
            >
              Prev
            </button>
            <span style={{ margin: "0 8px" }}>
              Page {pageIndex + 1}/{pages.length || 1}
            </span>
            <button
              onClick={() =>
                setPageIndex((i) => Math.min(pages.length - 1, i + 1))
              }
              disabled={pageIndex === pages.length - 1}
            >
              Next
            </button>
          </div>

          <div>
            <button onClick={like} style={{ marginRight: 8 }}>
              Like ({blog.likes?.length || blog.likes || 0})
            </button>
            <button onClick={shareCopy}>Copy Link</button>
          </div>
        </div>
      </div>

      <section style={{ marginTop: 18 }}>
        <h3>Comments</h3>
        <div className="card">
          {comments.length
            ? renderComments(nestComments(comments))
            : <div className="small">No comments yet</div>}
        </div>

        {user ? (
          <div className="card" style={{ marginTop: 8 }}>
            {replyTo && <p className="small">Replying to a comment</p>}
            <textarea
              placeholder="Write a comment..."
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
            />
            <div style={{ marginTop: 8 }}>
              <button
                onClick={postComment}
                style={{ background: "#2563eb", color: "white" }}
              >
                {replyTo ? "Reply" : "Post Comment"}
              </button>
            </div>
          </div>
        ) : (
          <div className="small">Login to comment</div>
        )}
      </section>
    </div>
  );
}
