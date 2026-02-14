const BASE = "http://127.0.0.1:8000";

export const api = async (url, options = {}) => {
  const res = await fetch(BASE + url, options);
  if (!res.ok) throw new Error("Request failed");
  return res.json();
};
