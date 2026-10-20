const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
const bcrypt = require("bcryptjs");
const { ARTICLES, TOPICS, DISCUSSIONS } = require("./demo-content");

const DATA_DIR = path.join(__dirname, "data");
const DATA_FILE = path.join(DATA_DIR, "db.json");

let mode = "json";
let pool = null;
let json = null;

const EMPTY = {
  admins: [],
  articles: [],
  topics: [],
  discussions: [],
  replies: [],
  subscribers: [],
  messages: [],
};

function now() {
  return new Date().toISOString();
}

function slugify(s) {
  return String(s)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-+|-+$)/g, "")
    .slice(0, 240);
}

function clone(v) {
  return JSON.parse(JSON.stringify(v));
}

function uniqueSlug(base, existing) {
  let slug = slugify(base);
  let n = 2;
  while (existing.includes(slug)) slug = `${slugify(base)}-${n++}`;
  return slug;
}

/* ---------------- JSON fallback store ---------------- */

function loadJson() {
  if (fs.existsSync(DATA_FILE)) {
    json = JSON.parse(fs.readFileSync(DATA_FILE, "utf8"));
  } else {
    json = clone(EMPTY);
  }
  for (const k of Object.keys(EMPTY)) if (!json[k]) json[k] = [];
  if (json.admins.length === 0) seedJson(json);
  saveJson();
}

function saveJson() {
  fs.mkdirSync(DATA_DIR, { recursive: true });
  fs.writeFileSync(DATA_FILE, JSON.stringify(json, null, 2));
}

function seedJson(db) {
  db.admins.push({
    id: 1,
    name: "Administrator",
    email: "nemmanuel@studentforliberty.org",
    password_hash: bcrypt.hashSync("liberty@123!", 10),
    created_at: now(),
  });
  ARTICLES.forEach((a, i) =>
    db.articles.push({
      id: i + 1,
      ...a,
      featured: !!a.featured,
      published: !!a.published,
      created_at: new Date(Date.now() - (ARTICLES.length - i) * 86400000).toISOString(),
      updated_at: now(),
    })
  );
  TOPICS.forEach((t, i) =>
    db.topics.push({
      id: i + 1,
      ...t,
      activities: JSON.parse(t.activities),
      featured: !!t.featured,
      published: !!t.published,
      created_at: now(),
    })
  );
  let rid = 1;
  DISCUSSIONS.forEach((d, i) => {
    db.discussions.push({
      id: i + 1,
      title: d.title,
      type: d.type,
      body: d.body,
      author_name: d.author_name,
      author_email: d.author_email,
      campus: d.campus,
      pinned: !!d.pinned,
      locked: !!d.locked,
      created_at: d.created_at,
    });
    (d.replies || []).forEach((r) =>
      db.replies.push({ id: rid++, discussion_id: i + 1, ...r })
    );
  });
}

/* ---------------- MySQL mappers ---------------- */

function mapArticle(r) {
  return {
    ...r,
    featured: !!r.featured,
    published: !!r.published,
  };
}

function mapTopic(r) {
  let activities = r.activities;
  if (typeof activities === "string") {
    try {
      activities = JSON.parse(activities);
    } catch {
      activities = [];
    }
  }
  return { ...r, activities: activities || [], featured: !!r.featured, published: !!r.published };
}

function mapDiscussion(r) {
  return { ...r, pinned: !!r.pinned, locked: !!r.locked };
}

/* ---------------- init ---------------- */

async function init() {
  if (process.env.DB === "mysql") {
    try {
      const mysql = require("mysql2/promise");
   pool = mysql.createPool({
  host: process.env.MYSQL_HOST,
  port: Number(process.env.MYSQL_PORT || 19655),
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DB || "defaultdb",
  ssl: {
    rejectUnauthorized: true,
  },
  waitForConnections: true,
  connectionLimit: 10,
});
      await pool.query("SELECT 1");
      mode = "mysql";
      console.log("[db] connected to MySQL");
      return;
    } catch (e) {
      console.warn("[db] MySQL unavailable, falling back to JSON store:", e.message);
      pool = null;
    }
  }
  loadJson();
  console.log("[db] using JSON store at", DATA_FILE);
}

function getMode() {
  return mode;
}

/* ---------------- admins ---------------- */

async function findAdminByEmail(email) {
  if (mode === "mysql") {
    const [rows] = await pool.query("SELECT * FROM admins WHERE email = ?", [email]);
    return rows[0] || null;
  }
  return json.admins.find((a) => a.email === email) || null;
}

async function countAdmins() {
  if (mode === "mysql") {
    const [rows] = await pool.query("SELECT COUNT(*) AS c FROM admins");
    return rows[0].c;
  }
  return json.admins.length;
}

async function createAdmin({ name, email, password }) {
  const hash = bcrypt.hashSync(password, 10);
  if (mode === "mysql") {
    const [res] = await pool.query(
      "INSERT INTO admins (name, email, password_hash) VALUES (?,?,?)",
      [name, email, hash]
    );
    return { id: res.insertId, name, email };
  }
  const id = Math.max(0, ...json.admins.map((a) => a.id)) + 1;
  const admin = { id, name, email, password_hash: hash, created_at: now() };
  json.admins.push(admin);
  saveJson();
  return { id, name, email };
}

function verifyPassword(admin, password) {
  return bcrypt.compareSync(password, admin.password_hash);
}

/* ---------------- articles ---------------- */

async function listArticles(opts = {}) {
  const { category, search, featured, published } = opts;
  if (mode === "mysql") {
    const where = [];
    const args = [];
    if (published !== undefined) {
      where.push("published = ?");
      args.push(published ? 1 : 0);
    }
    if (featured !== undefined) {
      where.push("featured = ?");
      args.push(featured ? 1 : 0);
    }
    if (category && category !== "All") {
      where.push("category = ?");
      args.push(category);
    }
    if (search) {
      where.push("(title LIKE ? OR excerpt LIKE ? OR content LIKE ?)");
      args.push(`%${search}%`, `%${search}%`, `%${search}%`);
    }
    const sql =
      "SELECT * FROM articles " +
      (where.length ? "WHERE " + where.join(" AND ") + " " : "") +
      "ORDER BY created_at DESC";
    const [rows] = await pool.query(sql, args);
    return rows.map(mapArticle);
  }
  let rows = json.articles.filter((a) => {
    if (published !== undefined && !!a.published !== !!published) return false;
    if (featured !== undefined && !!a.featured !== !!featured) return false;
    if (category && category !== "All" && a.category !== category) return false;
    if (search) {
      const s = search.toLowerCase();
      if (!(a.title + a.excerpt + a.content).toLowerCase().includes(s)) return false;
    }
    return true;
  });
  rows = rows.sort((a, b) => String(b.created_at).localeCompare(String(a.created_at)));
  return clone(rows);
}

async function getArticleBySlug(slug) {
  if (mode === "mysql") {
    const [rows] = await pool.query("SELECT * FROM articles WHERE slug = ?", [slug]);
    return rows[0] ? mapArticle(rows[0]) : null;
  }
  const a = json.articles.find((x) => x.slug === slug);
  return a ? clone(a) : null;
}

async function getArticleById(id) {
  if (mode === "mysql") {
    const [rows] = await pool.query("SELECT * FROM articles WHERE id = ?", [id]);
    return rows[0] ? mapArticle(rows[0]) : null;
  }
  const a = json.articles.find((x) => x.id === Number(id));
  return a ? clone(a) : null;
}

async function createArticle(data) {
  const fields = {
    title: data.title,
    slug: data.slug || slugify(data.title),
    excerpt: data.excerpt || "",
    content: data.content || "",
    category: data.category || "Freedom Ideas",
    author: data.author || "Liberty Reach Team",
    author_role: data.author_role || "Liberty Reach Contributor",
    image_url: data.image_url || "",
    featured: data.featured ? 1 : 0,
    published: data.published === undefined ? 1 : data.published ? 1 : 0,
  };
  if (mode === "mysql") {
    const existing = await pool.query("SELECT slug FROM articles WHERE slug = ?", [fields.slug]);
    if (existing[0].length) fields.slug = `${fields.slug}-${Date.now().toString(36)}`;
    const [res] = await pool.query(
      `INSERT INTO articles (title, slug, excerpt, content, category, author, author_role, image_url, featured, published)
       VALUES (?,?,?,?,?,?,?,?,?,?)`,
      [fields.title, fields.slug, fields.excerpt, fields.content, fields.category, fields.author, fields.author_role, fields.image_url, fields.featured, fields.published]
    );
    return getArticleById(res.insertId);
  }
  const slug = uniqueSlug(fields.slug, json.articles.map((a) => a.slug));
  const id = Math.max(0, ...json.articles.map((a) => a.id)) + 1;
  const article = { id, ...fields, slug, featured: !!fields.featured, published: !!fields.published, created_at: now(), updated_at: now() };
  json.articles.push(article);
  saveJson();
  return clone(article);
}

async function updateArticle(id, data) {
  if (mode === "mysql") {
    const cols = [];
    const args = [];
    const map = {
      title: "title", slug: "slug", excerpt: "excerpt", content: "content",
      category: "category", author: "author", author_role: "author_role", image_url: "image_url",
    };
    for (const [k, col] of Object.entries(map)) {
      if (data[k] !== undefined) {
        cols.push(`${col} = ?`);
        args.push(data[k]);
      }
    }
    if (data.featured !== undefined) { cols.push("featured = ?"); args.push(data.featured ? 1 : 0); }
    if (data.published !== undefined) { cols.push("published = ?"); args.push(data.published ? 1 : 0); }
    if (!cols.length) return getArticleById(id);
    args.push(id);
    await pool.query(`UPDATE articles SET ${cols.join(", ")} WHERE id = ?`, args);
    return getArticleById(id);
  }
  const a = json.articles.find((x) => x.id === Number(id));
  if (!a) return null;
  const map = ["title", "slug", "excerpt", "content", "category", "author", "author_role", "image_url"];
  for (const k of map) if (data[k] !== undefined) a[k] = data[k];
  if (data.featured !== undefined) a.featured = !!data.featured;
  if (data.published !== undefined) a.published = !!data.published;
  a.updated_at = now();
  saveJson();
  return clone(a);
}

async function deleteArticle(id) {
  if (mode === "mysql") {
    await pool.query("DELETE FROM articles WHERE id = ?", [id]);
    return true;
  }
  const i = json.articles.findIndex((x) => x.id === Number(id));
  if (i === -1) return false;
  json.articles.splice(i, 1);
  saveJson();
  return true;
}

/* ---------------- topics ---------------- */

async function listTopics(opts = {}) {
  const { published, featured } = opts;
  if (mode === "mysql") {
    const where = [];
    const args = [];
    if (published !== undefined) { where.push("published = ?"); args.push(published ? 1 : 0); }
    if (featured !== undefined) { where.push("featured = ?"); args.push(featured ? 1 : 0); }
    const sql =
      "SELECT * FROM topics " +
      (where.length ? "WHERE " + where.join(" AND ") + " " : "") +
      "ORDER BY year DESC, FIELD(month_label,'January','February','March','April','May','June','July','August','September','October','November','December') DESC";
    const [rows] = await pool.query(sql, args);
    return rows.map(mapTopic);
  }
  const rows = json.topics.filter((t) => {
    if (published !== undefined && !!t.published !== !!published) return false;
    if (featured !== undefined && !!t.featured !== !!featured) return false;
    return true;
  });
  const order = ["January","February","March","April","May","June","July","August","September","October","November","December"];
  rows.sort((a, b) => b.year - a.year || order.indexOf(b.month_label) - order.indexOf(a.month_label));
  return clone(rows);
}

async function getTopicBySlug(slug) {
  if (mode === "mysql") {
    const [rows] = await pool.query("SELECT * FROM topics WHERE slug = ?", [slug]);
    return rows[0] ? mapTopic(rows[0]) : null;
  }
  const t = json.topics.find((x) => x.slug === slug);
  return t ? clone(t) : null;
}

async function getTopicById(id) {
  if (mode === "mysql") {
    const [rows] = await pool.query("SELECT * FROM topics WHERE id = ?", [id]);
    return rows[0] ? mapTopic(rows[0]) : null;
  }
  const t = json.topics.find((x) => x.id === Number(id));
  return t ? clone(t) : null;
}

async function createTopic(data) {
  const fields = {
    title: data.title,
    slug: data.slug || slugify(data.title),
    month_label: data.month_label || "January",
    year: Number(data.year) || new Date().getFullYear(),
    summary: data.summary || "",
    description: data.description || "",
    activities: Array.isArray(data.activities) ? data.activities : [],
    featured: data.featured ? 1 : 0,
    published: data.published === undefined ? 1 : data.published ? 1 : 0,
  };
  if (mode === "mysql") {
    const [res] = await pool.query(
      `INSERT INTO topics (title, slug, month_label, year, summary, description, activities, featured, published)
       VALUES (?,?,?,?,?,?,?,?,?)`,
      [fields.title, fields.slug, fields.month_label, fields.year, fields.summary, fields.description, JSON.stringify(fields.activities), fields.featured, fields.published]
    );
    return getTopicById(res.insertId);
  }
  const slug = uniqueSlug(fields.slug, json.topics.map((t) => t.slug));
  const id = Math.max(0, ...json.topics.map((t) => t.id)) + 1;
  const topic = { id, ...fields, slug, featured: !!fields.featured, published: !!fields.published, created_at: now() };
  json.topics.push(topic);
  saveJson();
  return clone(topic);
}

async function updateTopic(id, data) {
  if (mode === "mysql") {
    const cols = [];
    const args = [];
    for (const k of ["title", "slug", "month_label", "summary", "description"]) {
      if (data[k] !== undefined) { cols.push(`${k} = ?`); args.push(data[k]); }
    }
    if (data.year !== undefined) { cols.push("year = ?"); args.push(Number(data.year)); }
    if (data.activities !== undefined) { cols.push("activities = ?"); args.push(JSON.stringify(data.activities)); }
    if (data.featured !== undefined) { cols.push("featured = ?"); args.push(data.featured ? 1 : 0); }
    if (data.published !== undefined) { cols.push("published = ?"); args.push(data.published ? 1 : 0); }
    if (cols.length) {
      args.push(id);
      await pool.query(`UPDATE topics SET ${cols.join(", ")} WHERE id = ?`, args);
    }
    return getTopicById(id);
  }
  const t = json.topics.find((x) => x.id === Number(id));
  if (!t) return null;
  for (const k of ["title", "slug", "month_label", "summary", "description"]) {
    if (data[k] !== undefined) t[k] = data[k];
  }
  if (data.year !== undefined) t.year = Number(data.year);
  if (data.activities !== undefined) t.activities = data.activities;
  if (data.featured !== undefined) t.featured = !!data.featured;
  if (data.published !== undefined) t.published = !!data.published;
  saveJson();
  return clone(t);
}

async function deleteTopic(id) {
  if (mode === "mysql") {
    await pool.query("DELETE FROM topics WHERE id = ?", [id]);
    return true;
  }
  const i = json.topics.findIndex((x) => x.id === Number(id));
  if (i === -1) return false;
  json.topics.splice(i, 1);
  saveJson();
  return true;
}

/* ---------------- discussions ---------------- */

function orderDiscussions(list) {
  return list.sort((a, b) => Number(b.pinned) - Number(a.pinned) || String(b.created_at).localeCompare(String(a.created_at)));
}

async function listDiscussions(opts = {}) {
  const { type, search } = opts;
  if (mode === "mysql") {
    const where = [];
    const args = [];
    if (type && type !== "all") { where.push("type = ?"); args.push(type); }
    if (search) { where.push("(title LIKE ? OR body LIKE ?)"); args.push(`%${search}%`, `%${search}%`); }
    let sql =
      "SELECT d.*, (SELECT COUNT(*) FROM discussion_replies r WHERE r.discussion_id = d.id) AS reply_count FROM discussions d " +
      (where.length ? "WHERE " + where.join(" AND ") + " " : "") +
      "ORDER BY d.pinned DESC, d.created_at DESC";
    const [rows] = await pool.query(sql, args);
    return rows.map((r) => mapDiscussion({ ...r, reply_count: Number(r.reply_count) }));
  }
  let rows = json.discussions.filter((d) => {
    if (type && type !== "all" && d.type !== type) return false;
    if (search) {
      const s = search.toLowerCase();
      if (!(d.title + d.body).toLowerCase().includes(s)) return false;
    }
    return true;
  }).map((d) => ({
    ...d,
    reply_count: json.replies.filter((r) => r.discussion_id === d.id).length,
  }));
  return clone(orderDiscussions(rows));
}

async function getDiscussionById(id) {
  let disc = null;
  if (mode === "mysql") {
    const [rows] = await pool.query("SELECT * FROM discussions WHERE id = ?", [id]);
    if (!rows[0]) return null;
    disc = mapDiscussion(rows[0]);
    const [reps] = await pool.query(
      "SELECT * FROM discussion_replies WHERE discussion_id = ? ORDER BY created_at ASC",
      [id]
    );
    disc.replies = reps;
  } else {
    const d = json.discussions.find((x) => x.id === Number(id));
    if (!d) return null;
    disc = clone(d);
    disc.replies = json.replies
      .filter((r) => r.discussion_id === d.id)
      .sort((a, b) => String(a.created_at).localeCompare(String(b.created_at)));
  }
  return disc;
}

async function createDiscussion(data) {
  const fields = {
    title: data.title,
    type: data.type === "opinion" ? "opinion" : "question",
    body: data.body || "",
    author_name: data.author_name,
    author_email: data.author_email || "",
    campus: data.campus || "",
  };
  if (mode === "mysql") {
    const [res] = await pool.query(
      `INSERT INTO discussions (title, type, body, author_name, author_email, campus) VALUES (?,?,?,?,?,?)`,
      [fields.title, fields.type, fields.body, fields.author_name, fields.author_email, fields.campus]
    );
    return getDiscussionById(res.insertId);
  }
  const id = Math.max(0, ...json.discussions.map((d) => d.id)) + 1;
  json.discussions.push({ id, ...fields, pinned: false, locked: false, created_at: now() });
  saveJson();
  return getDiscussionById(id);
}

async function addReply(discussionId, data) {
  const disc = await getDiscussionById(discussionId);
  if (!disc) return null;
  if (disc.locked) throw new Error("This discussion is locked.");
  if (mode === "mysql") {
    await pool.query(
      "INSERT INTO discussion_replies (discussion_id, author_name, body) VALUES (?,?,?)",
      [discussionId, data.author_name, data.body]
    );
    return getDiscussionById(discussionId);
  }
  const id = Math.max(0, ...json.replies.map((r) => r.id)) + 1;
  json.replies.push({ id, discussion_id: Number(discussionId), author_name: data.author_name, body: data.body, created_at: now() });
  saveJson();
  return getDiscussionById(discussionId);
}

async function updateDiscussion(id, data) {
  if (mode === "mysql") {
    const cols = [];
    const args = [];
    if (data.pinned !== undefined) { cols.push("pinned = ?"); args.push(data.pinned ? 1 : 0); }
    if (data.locked !== undefined) { cols.push("locked = ?"); args.push(data.locked ? 1 : 0); }
    if (cols.length) {
      args.push(id);
      await pool.query(`UPDATE discussions SET ${cols.join(", ")} WHERE id = ?`, args);
    }
    return getDiscussionById(id);
  }
  const d = json.discussions.find((x) => x.id === Number(id));
  if (!d) return null;
  if (data.pinned !== undefined) d.pinned = !!data.pinned;
  if (data.locked !== undefined) d.locked = !!data.locked;
  saveJson();
  return getDiscussionById(id);
}

async function deleteDiscussion(id) {
  if (mode === "mysql") {
    await pool.query("DELETE FROM discussion_replies WHERE discussion_id = ?", [id]);
    await pool.query("DELETE FROM discussions WHERE id = ?", [id]);
    return true;
  }
  const i = json.discussions.findIndex((x) => x.id === Number(id));
  if (i === -1) return false;
  json.discussions.splice(i, 1);
  json.replies = json.replies.filter((r) => r.discussion_id !== Number(id));
  saveJson();
  return true;
}

async function deleteReply(discussionId, replyId) {
  if (mode === "mysql") {
    await pool.query("DELETE FROM discussion_replies WHERE id = ? AND discussion_id = ?", [replyId, discussionId]);
    return true;
  }
  const i = json.replies.findIndex((r) => r.id === Number(replyId) && r.discussion_id === Number(discussionId));
  if (i === -1) return false;
  json.replies.splice(i, 1);
  saveJson();
  return true;
}

/* ---------------- subscribers & messages ---------------- */

async function listSubscribers() {
  if (mode === "mysql") {
    const [rows] = await pool.query("SELECT * FROM subscribers ORDER BY created_at DESC");
    return rows;
  }
  return clone([...json.subscribers].sort((a, b) => String(b.created_at).localeCompare(String(a.created_at))));
}

async function createSubscriber(data) {
  const email = String(data.email || "").trim().toLowerCase();
  if (!email) throw new Error("Email is required.");
  if (mode === "mysql") {
    try {
      const [res] = await pool.query(
        "INSERT INTO subscribers (name, email, campus, country) VALUES (?,?,?,?)",
        [data.name || "Friend", email, data.campus || "", data.country || ""]
      );
      return { id: res.insertId };
    } catch (e) {
      if (String(e.message).includes("Duplicate")) return { duplicate: true };
      throw e;
    }
  }
  if (json.subscribers.some((s) => s.email === email)) return { duplicate: true };
  const id = Math.max(0, ...json.subscribers.map((s) => s.id)) + 1;
  json.subscribers.push({ id, name: data.name || "Friend", email, campus: data.campus || "", country: data.country || "", created_at: now() });
  saveJson();
  return { id };
}

async function deleteSubscriber(id) {
  if (mode === "mysql") {
    await pool.query("DELETE FROM subscribers WHERE id = ?", [id]);
    return true;
  }
  const i = json.subscribers.findIndex((s) => s.id === Number(id));
  if (i === -1) return false;
  json.subscribers.splice(i, 1);
  saveJson();
  return true;
}

async function listMessages() {
  if (mode === "mysql") {
    const [rows] = await pool.query("SELECT * FROM messages ORDER BY created_at DESC");
    return rows;
  }
  return clone([...json.messages].sort((a, b) => String(b.created_at).localeCompare(String(a.created_at))));
}

async function createMessage(data) {
  if (mode === "mysql") {
    const [res] = await pool.query(
      "INSERT INTO messages (name, email, subject, body) VALUES (?,?,?,?)",
      [data.name, data.email, data.subject || "", data.body || ""]
    );
    return { id: res.insertId };
  }
  const id = Math.max(0, ...json.messages.map((m) => m.id)) + 1;
  json.messages.push({ id, name: data.name, email: data.email, subject: data.subject || "", body: data.body || "", created_at: now() });
  saveJson();
  return { id };
}

async function deleteMessage(id) {
  if (mode === "mysql") {
    await pool.query("DELETE FROM messages WHERE id = ?", [id]);
    return true;
  }
  const i = json.messages.findIndex((m) => m.id === Number(id));
  if (i === -1) return false;
  json.messages.splice(i, 1);
  saveJson();
  return true;
}

/* ---------------- stats ---------------- */

async function getStats() {
  const [articles, topics, discussions, subs, msgs] = await Promise.all([
    listArticles({}),
    listTopics({}),
    listDiscussions({}),
    listSubscribers(),
    listMessages(),
  ]);
  const replies = mode === "mysql"
    ? (await pool.query("SELECT COUNT(*) AS c FROM discussion_replies"))[0][0].c
    : json.replies.length;
  return {
    articles: articles.length,
    published_articles: articles.filter((a) => a.published).length,
    topics: topics.length,
    discussions: discussions.length,
    replies: Number(replies),
    subscribers: subs.length,
    messages: msgs.length,
  };
}

module.exports = {
  init, getMode, slugify,
  findAdminByEmail, countAdmins, createAdmin, verifyPassword,
  listArticles, getArticleBySlug, getArticleById, createArticle, updateArticle, deleteArticle,
  listTopics, getTopicBySlug, getTopicById, createTopic, updateTopic, deleteTopic,
  listDiscussions, getDiscussionById, createDiscussion, addReply, updateDiscussion, deleteDiscussion, deleteReply,
  listSubscribers, createSubscriber, deleteSubscriber,
  listMessages, createMessage, deleteMessage,
  getStats,
};
