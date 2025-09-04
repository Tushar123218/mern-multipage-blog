import React, { useEffect, useState } from "react";
import API from "../utils/api";
import { getUser } from "../utils/auth";

export default function Profile() {
  const user = getUser();
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      if (!user) return;
      try {
        // ✅ Updated API call with /api prefix
        const data = await API.get(`/api/users/${user.id || user._id}/history`);
        // If your API returns { history: [...] } normalize it
        setHistory(data.history || data);
      } catch (e) {
        console.error("Failed to fetch history:", e);
      } finally {
        setLoading(false);
      }
    })();
  }, [user]);

  if (!user) return <div className="card">Login to see your profile</div>;
  if (loading) return <div className="card">Loading...</div>;

  return (
    <div>
      <h2>Profile</h2>
      <div className="card">
        <h3>{user.username}</h3>
        <p className="small">{user.email}</p>
      </div>

      <h3 style={{ marginTop: 12 }}>Activity</h3>
      {history.length === 0 && <div className="card small">No activity yet</div>}

      {history.map((h, i) => (
        <div key={i} className="card" style={{ marginTop: 8 }}>
          <div className="small">{new Date(h.timestamp).toLocaleString()}</div>
          <div style={{ fontWeight: 600, marginTop: 6 }}>{h.action}</div>
          <div className="small" style={{ marginTop: 6 }}>
            {h.blogId ? `Blog: ${h.blogId.title || h.blogId}` : ""}
            {h.pageId ? ` • Page: ${h.pageId.title || h.pageId}` : ""}
            {h.commentId ? ` • Comment: ${h.commentId.content || h.commentId}` : ""}
          </div>
        </div>
      ))}
    </div>
  );
}
