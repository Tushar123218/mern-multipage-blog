const API_BASE = process.env.REACT_APP_API_URL;

async function request(endpoint, options = {}) {
  const url = `${API_BASE}${endpoint}`;
  const headers = options.headers || {};
  // default JSON header (unless explicitly set)
  if (!headers["Content-Type"] && !(options.body instanceof FormData)) {
    headers["Content-Type"] = "application/json";
  }
  // attach token if present
  const token = localStorage.getItem("token");
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const res = await fetch(url, { ...options, headers });
  const text = await res.text();
  let data;
  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    data = text;
  }
  if (!res.ok) {
    // normalize error
    const message = data?.message || data?.error || res.statusText || "Request failed";
    const error = new Error(message);
    error.status = res.status;
    error.payload = data;
    throw error;
  }
  return data;
}

export default {
  get: (ep) => request(ep, { method: "GET" }),
  post: (ep, body) => request(ep, { method: "POST", body: JSON.stringify(body) }),
  put: (ep, body) => request(ep, { method: "PUT", body: JSON.stringify(body) }),
  patch: (ep, body) => request(ep, { method: "PATCH", body: JSON.stringify(body) }),
  del: (ep) => request(ep, { method: "DELETE" }),
};
