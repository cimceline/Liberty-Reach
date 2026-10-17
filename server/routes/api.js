const express = require("express");
const jwt = require("jsonwebtoken");
const db = require("../db");

const router = express.Router();

const SECRET = process.env.JWT_SECRET || "liberty-reach-dev-secret-change-me";
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function sign(admin) {
  return jwt.sign(
    { id: admin.id, name: admin.name, email: admin.email },
    SECRET,
    { expiresIn: "8h" }
  );
}

function adminOnly(req, res, next) {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : null;
  if (!token) return res.status(401).json({ error: "Unauthorized" });
  try {
    req.admin = jwt.verify(token, SECRET);
    next();
  } catch {
    res.status(401).json({ error: "Session expired. Please log in again." });
  }
}

/* ---------- public ---------- */

router.get("/public/health", (req, res) => {
  res.json({ ok: true, db: db.getMode() });
});

router.get("/public/articles", async (req, res, next) => {
  try {
    const articles = await db.listArticles({
      category: req.query.category,
      search: req.query.search,
      featured: req.query.featured === "1" ? true : undefined,
      published: true,
    });
    res.json(articles);
  } catch (e) { next(e); }
});

router.get("/public/articles/:slug", async (req, res, next) => {
  try {
    const article = await db.getArticleBySlug(req.params.slug);
    if (!article || !article.published) return res.status(404).json({ error: "Story not found" });
    res.json(article);
  } catch (e) { next(e); }
});

router.get("/public/topics", async (req, res, next) => {
  try {
    res.json(await db.listTopics({ published: true }));
  } catch (e) { next(e); }
});

router.get("/public/topics/:slug", async (req, res, next) => {
  try {
    const topic = await db.getTopicBySlug(req.params.slug);
    if (!topic || !topic.published) return res.status(404).json({ error: "Topic not found" });
    res.json(topic);
  } catch (e) { next(e); }
});

router.get("/public/discussions", async (req, res, next) => {
  try {
    res.json(await db.listDiscussions({ type: req.query.type, search: req.query.search }));
  } catch (e) { next(e); }
});

router.get("/public/discussions/:id", async (req, res, next) => {
  try {
    const disc = await db.getDiscussionById(req.params.id);
    if (!disc) return res.status(404).json({ error: "Discussion not found" });
    res.json(disc);
  } catch (e) { next(e); }
});

router.post("/public/discussions", async (req, res, next) => {
  try {
    const { title, body, author_name } = req.body || {};
    if (!title || !title.trim()) return res.status(400).json({ error: "Title is required" });
    if (!body || !body.trim()) return res.status(400).json({ error: "Please write your message" });
    if (!author_name || !author_name.trim()) return res.status(400).json({ error: "Your name is required" });
    if (req.body.author_email && !EMAIL_RE.test(req.body.author_email))
      return res.status(400).json({ error: "Please enter a valid email" });
    res.status(201).json(await db.createDiscussion(req.body));
  } catch (e) { next(e); }
});

router.post("/public/discussions/:id/replies", async (req, res, next) => {
  try {
    const { author_name, body } = req.body || {};
    if (!author_name || !author_name.trim()) return res.status(400).json({ error: "Your name is required" });
    if (!body || !body.trim()) return res.status(400).json({ error: "Please write your reply" });
    const disc = await db.addReply(req.params.id, { author_name, body });
    res.status(201).json(disc);
  } catch (e) {
    if (e.message === "This discussion is locked.") return res.status(423).json({ error: e.message });
    next(e);
  }
});

router.post("/public/join", async (req, res, next) => {
  try {
    const { name, email } = req.body || {};
    if (!name || !name.trim()) return res.status(400).json({ error: "Name is required" });
    if (!email || !EMAIL_RE.test(email)) return res.status(400).json({ error: "A valid email is required" });
    const result = await db.createSubscriber(req.body);
    res.status(201).json({ ok: true, duplicate: !!result.duplicate });
  } catch (e) { next(e); }
});

router.post("/public/contact", async (req, res, next) => {
  try {
    const { name, email, body } = req.body || {};
    if (!name || !name.trim()) return res.status(400).json({ error: "Name is required" });
    if (!email || !EMAIL_RE.test(email)) return res.status(400).json({ error: "A valid email is required" });
    if (!body || !body.trim()) return res.status(400).json({ error: "Message is required" });
    await db.createMessage(req.body);
    res.status(201).json({ ok: true });
  } catch (e) { next(e); }
});

/* ---------- admin ---------- */

router.post("/admin/login", async (req, res, next) => {
  try {
    const { email, password } = req.body || {};
    const admin = await db.findAdminByEmail(String(email || "").trim().toLowerCase());
    if (!admin || !db.verifyPassword(admin, String(password || "")))
      return res.status(401).json({ error: "Invalid email or password" });
    res.json({ token: sign(admin), admin: { id: admin.id, name: admin.name, email: admin.email } });
  } catch (e) { next(e); }
});

router.get("/admin/stats", adminOnly, async (req, res, next) => {
  try { res.json(await db.getStats()); } catch (e) { next(e); }
});

router.get("/admin/articles", adminOnly, async (req, res, next) => {
  try { res.json(await db.listArticles({})); } catch (e) { next(e); }
});

router.get("/admin/articles/:id", adminOnly, async (req, res, next) => {
  try {
    const a = await db.getArticleById(req.params.id);
    if (!a) return res.status(404).json({ error: "Not found" });
    res.json(a);
  } catch (e) { next(e); }
});

router.post("/admin/articles", adminOnly, async (req, res, next) => {
  try {
    if (!req.body.title || !req.body.title.trim()) return res.status(400).json({ error: "Title is required" });
    res.status(201).json(await db.createArticle(req.body));
  } catch (e) { next(e); }
});

router.put("/admin/articles/:id", adminOnly, async (req, res, next) => {
  try {
    const a = await db.updateArticle(req.params.id, req.body);
    if (!a) return res.status(404).json({ error: "Not found" });
    res.json(a);
  } catch (e) { next(e); }
});

router.delete("/admin/articles/:id", adminOnly, async (req, res, next) => {
  try { res.json({ ok: await db.deleteArticle(req.params.id) }); } catch (e) { next(e); }
});

router.get("/admin/topics", adminOnly, async (req, res, next) => {
  try { res.json(await db.listTopics({})); } catch (e) { next(e); }
});

router.get("/admin/topics/:id", adminOnly, async (req, res, next) => {
  try {
    const t = await db.getTopicById(req.params.id);
    if (!t) return res.status(404).json({ error: "Not found" });
    res.json(t);
  } catch (e) { next(e); }
});

router.post("/admin/topics", adminOnly, async (req, res, next) => {
  try {
    if (!req.body.title || !req.body.title.trim()) return res.status(400).json({ error: "Title is required" });
    res.status(201).json(await db.createTopic(req.body));
  } catch (e) { next(e); }
});

router.put("/admin/topics/:id", adminOnly, async (req, res, next) => {
  try {
    const t = await db.updateTopic(req.params.id, req.body);
    if (!t) return res.status(404).json({ error: "Not found" });
    res.json(t);
  } catch (e) { next(e); }
});

router.delete("/admin/topics/:id", adminOnly, async (req, res, next) => {
  try { res.json({ ok: await db.deleteTopic(req.params.id) }); } catch (e) { next(e); }
});

router.get("/admin/discussions", adminOnly, async (req, res, next) => {
  try { res.json(await db.listDiscussions({ type: req.query.type })); } catch (e) { next(e); }
});

router.get("/admin/discussions/:id", adminOnly, async (req, res, next) => {
  try {
    const d = await db.getDiscussionById(req.params.id);
    if (!d) return res.status(404).json({ error: "Not found" });
    res.json(d);
  } catch (e) { next(e); }
});

router.put("/admin/discussions/:id", adminOnly, async (req, res, next) => {
  try {
    const d = await db.updateDiscussion(req.params.id, req.body);
    if (!d) return res.status(404).json({ error: "Not found" });
    res.json(d);
  } catch (e) { next(e); }
});

router.delete("/admin/discussions/:id", adminOnly, async (req, res, next) => {
  try { res.json({ ok: await db.deleteDiscussion(req.params.id) }); } catch (e) { next(e); }
});

router.delete("/admin/discussions/:id/replies/:replyId", adminOnly, async (req, res, next) => {
  try { res.json({ ok: await db.deleteReply(req.params.id, req.params.replyId) }); } catch (e) { next(e); }
});

router.get("/admin/subscribers", adminOnly, async (req, res, next) => {
  try { res.json(await db.listSubscribers()); } catch (e) { next(e); }
});

router.delete("/admin/subscribers/:id", adminOnly, async (req, res, next) => {
  try { res.json({ ok: await db.deleteSubscriber(req.params.id) }); } catch (e) { next(e); }
});

router.get("/admin/messages", adminOnly, async (req, res, next) => {
  try { res.json(await db.listMessages()); } catch (e) { next(e); }
});

router.delete("/admin/messages/:id", adminOnly, async (req, res, next) => {
  try { res.json({ ok: await db.deleteMessage(req.params.id) }); } catch (e) { next(e); }
});

module.exports = router;
