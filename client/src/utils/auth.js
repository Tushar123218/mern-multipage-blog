export const saveAuth = (token, user) => {
  if (token) localStorage.setItem("token", token);
  if (user) localStorage.setItem("user", JSON.stringify(user));
};

export const clearAuth = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
};

export const getUser = () => {
  const raw = localStorage.getItem("user");
  return raw ? JSON.parse(raw) : null;
};

export const getToken = () => localStorage.getItem("token");
