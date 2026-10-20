// Seeds the MySQL database with schema + demo content.
// Usage:  npm run seed            (MySQL mode: DB=mysql node server/seed.js)
//         DB=mysql npm run seed
const path = require("path");
const fs = require("fs");
const bcrypt = require("bcryptjs");
const { ARTICLES, TOPICS, DISCUSSIONS } = require("./demo-content");

async function main() {
  const envFile = path.join(__dirname, "..", ".env");
  if (fs.existsSync(envFile)) {
    for (const line of fs.readFileSync(envFile, "utf8").split(/\r?\n/)) {
      const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/i);
      if (m && process.env[m[1]] === undefined) process.env[m[1]] = m[2].replace(/^["']|["']$/g, "");
    }
  }

  const mysql = require("mysql2/promise");
 const conn = await mysql.createConnection({
  host: process.env.MYSQL_HOST,
  port: Number(process.env.MYSQL_PORT || 19655),
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DB || "defaultdb",
  ssl: {
    rejectUnauthorized: true,
  },
  multipleStatements: true,
});

console.log("Connected to Aiven MySQL.");
await conn.query("USE defaultdb");

  const [admins] = await conn.query("SELECT id FROM admins LIMIT 1");
  if (admins.length) {
    console.log("Admin already exists — skipping seed of admin/articles/topics/discussions.");
    await conn.end();
    return;
  }

  const hash = bcrypt.hashSync("liberty@123!", 10);
  await conn.query("INSERT INTO admins (name, email, password_hash) VALUES (?,?,?)", [
    "Administrator",
    "nemmanuel@studentforliberty.org",
    hash,
  ]);

  for (const a of ARTICLES) {
    await conn.query(
      `INSERT INTO articles (title, slug, excerpt, content, category, author, author_role, image_url, featured, published)
       VALUES (?,?,?,?,?,?,?,?,?,?)`,
      [a.title, a.slug, a.excerpt, a.content, a.category, a.author, a.author_role, a.image_url, a.featured, a.published]
    );
  }

  for (const t of TOPICS) {
    await conn.query(
      `INSERT INTO topics (title, slug, month_label, year, summary, description, activities, featured, published)
       VALUES (?,?,?,?,?,?,?,?,?)`,
      [t.title, t.slug, t.month_label, t.year, t.summary, t.description, t.activities, t.featured, t.published]
    );
  }

 for (const d of DISCUSSIONS) {
  const [res] = await conn.query(
    `INSERT INTO discussions (title, type, body, author_name, author_email, campus, pinned, locked, created_at)
     VALUES (?,?,?,?,?,?,?,?,?)`,
    [d.title, d.type, d.body, d.author_name, d.author_email, d.campus, d.pinned, d.locked, new Date(d.created_at)]
  );

  for (const r of d.replies || []) {
    await conn.query(
      "INSERT INTO discussion_replies (discussion_id, author_name, body, created_at) VALUES (?,?,?,?)",
      [res.insertId, r.author_name, r.body, new Date(r.created_at)]
    );
  }
}

  console.log("Seed complete.");
  console.log("Admin login:  nemmanuel@studentsforliberty.org  /  liberty@123!  (change this password!)");
  await conn.end();
}

main().catch((e) => {
  console.error("Seed failed:", e.message);
  process.exit(1);
});
