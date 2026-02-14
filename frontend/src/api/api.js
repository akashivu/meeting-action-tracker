const BASE = "https://meeting-action-tracker-rm8y.onrender.com";

export const api = async (url, options = {}) => {
  const res = await fetch(BASE + url, options);
  if (!res.ok) throw new Error("Request failed");
  return res.json();
};
