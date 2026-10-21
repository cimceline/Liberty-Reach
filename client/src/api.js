const BASE = "https://liberty-reach.onrender.com/api";

function getToken() {
  return localStorage.getItem("lr_token");
}

export function setSession(token, admin) {
  localStorage.setItem("lr_token", token);
  localStorage.setItem("lr_admin", JSON.stringify(admin));
}

export function clearSession() {
  localStorage.removeItem("lr_token");
  localStorage.removeItem("lr_admin");
}

export function getAdmin() {
  try {
    return JSON.parse(localStorage.getItem("lr_admin") || "null");
  } catch {
    return null;
  }
}

async function request(path, { method = "GET", body, auth = false } = {}) {
  const headers = { "Content-Type": "application/json" };
  if (auth) {
    const token = getToken();
    if (token) headers.Authorization = `Bearer ${token}`;
  }
  const res = await fetch(`${BASE}${path}`, {
    method,
    headers,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });
  let data = null;
  try {
    data = await res.json();
  } catch {
    data = null;
  }
  if (!res.ok) {
    const err = new Error((data && data.error) || `Request failed (${res.status})`);
    err.status = res.status;
    throw err;
  }
  return data;
}

export const api = {
  // public
  articles: (params = {}) => request(`/public/articles${qs(params)}`),
  article: (slug) => request(`/public/articles/${encodeURIComponent(slug)}`),
  topics: () => request("/public/topics"),
  topic: (slug) => request(`/public/topics/${encodeURIComponent(slug)}`),
  discussions: (params = {}) => request(`/public/discussions${qs(params)}`),
  discussion: (id) => request(`/public/discussions/${id}`),
  createDiscussion: (body) => request("/public/discussions", { method: "POST", body }),
  reply: (id, body) => request(`/public/discussions/${id}/replies`, { method: "POST", body }),
  join: (body) => request("/public/join", { method: "POST", body }),
  contact: (body) => request("/public/contact", { method: "POST", body }),

  // admin
  login: (body) => request("/admin/login", { method: "POST", body }),
  stats: () => request("/admin/stats", { auth: true }),
  adminArticles: () => request("/admin/articles", { auth: true }),
  adminArticle: (id) => request(`/admin/articles/${id}`, { auth: true }),
  createArticle: (body) => request("/admin/articles", { method: "POST", body, auth: true }),
  updateArticle: (id, body) => request(`/admin/articles/${id}`, { method: "PUT", body, auth: true }),
  deleteArticle: (id) => request(`/admin/articles/${id}`, { method: "DELETE", auth: true }),
  adminTopics: () => request("/admin/topics", { auth: true }),
  adminTopic: (id) => request(`/admin/topics/${id}`, { auth: true }),
  createTopic: (body) => request("/admin/topics", { method: "POST", body, auth: true }),
  updateTopic: (id, body) => request(`/admin/topics/${id}`, { method: "PUT", body, auth: true }),
  deleteTopic: (id) => request(`/admin/topics/${id}`, { method: "DELETE", auth: true }),
  adminDiscussions: (params = {}) => request(`/admin/discussions${qs(params)}`, { auth: true }),
  adminDiscussion: (id) => request(`/admin/discussions/${id}`, { auth: true }),
  updateDiscussion: (id, body) => request(`/admin/discussions/${id}`, { method: "PUT", body, auth: true }),
  deleteDiscussion: (id) => request(`/admin/discussions/${id}`, { method: "DELETE", auth: true }),
  deleteReply: (id, replyId) => request(`/admin/discussions/${id}/replies/${replyId}`, { method: "DELETE", auth: true }),
  subscribers: () => request("/admin/subscribers", { auth: true }),
  deleteSubscriber: (id) => request(`/admin/subscribers/${id}`, { method: "DELETE", auth: true }),
  messages: () => request("/admin/messages", { auth: true }),
  deleteMessage: (id) => request(`/admin/messages/${id}`, { method: "DELETE", auth: true }),
};

function qs(params) {
  const entries = Object.entries(params).filter(([, v]) => v !== undefined && v !== null && v !== "");
  return entries.length ? "?" + new URLSearchParams(entries).toString() : "";
}

export function formatDate(iso) {
  if (!iso) return "";
  const d = new Date(iso);
  return d.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
}

export function excerptFrom(content, max = 180) {
  const text = String(content || "").replace(/\s+/g, " ").trim();
  return text.length > max ? text.slice(0, max).trim() + "…" : text;
}
