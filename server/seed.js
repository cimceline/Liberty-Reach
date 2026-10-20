
 // Seeds the MySQL database with demo content.
 // Run with: npm run seed

const path = require("path");
const fs = require("fs");
const bcrypt = require("bcryptjs");
const { ARTICLES, TOPICS, DISCUSSIONS } = require("./demo-content");

async function main() {
  // Load local .env variables when running locally.
  const envFile = path.join(__dirname, "..", ".env");

  if (fs.existsSync(envFile)) {
    for (const line of fs.readFileSync(envFile, "utf8").split(/\r?\n/)) {
      const match = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/i);

      if (match && process.env[match[1]] === undefined) {
        process.env[match[1]] = match[2].replace(/^["']|["']$/g, "");
      }
    }
  }

  // Check that the required database settings exist.
  const requiredVariables = [
    "MYSQL_HOST",
    "MYSQL_USER",
    "MYSQL_PASSWORD",
    "MYSQL_CA_CERT",
  ];

  const missingVariables = requiredVariables.filter(
    (name) => !process.env[name]
  );

  if (missingVariables.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missingVariables.join(", ")}`
    );
  }

  const mysql = require("mysql2/promise");

  const conn = await mysql.createConnection({
    host: process.env.MYSQL_HOST,
    port: Number(process.env.MYSQL_PORT || 19655),
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DB || "defaultdb",
    ssl: {
      ca: process.env.MYSQL_CA_CERT,
      rejectUnauthorized: true,
    },
    multipleStatements: true,
  });

  try {
    console.log("Connected to Aiven MySQL.");

    const [admins] = await conn.query(
      "SELECT id FROM admins LIMIT 1"
    );

    // Avoid inserting the demo content a second time.
    if (admins.length > 0) {
      console.log(
        "An admin already exists. Skipping demo seeding to avoid duplicates."
      );
      return;
    }

    // Create the initial administrator account.
    const hash = await bcrypt.hash("liberty@123!", 10);

    await conn.query(
      "INSERT INTO admins (name, email, password_hash) VALUES (?, ?, ?)",
      [
        "Administrator",
        "nemmanuel@studentforliberty.org",
        hash,
      ]
    );

    // Insert demo articles.
    for (const article of ARTICLES) {
      await conn.query(
        `INSERT INTO articles
          (title, slug, excerpt, content, category, author, author_role,
           image_url, featured, published)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          article.title,
          article.slug,
          article.excerpt,
          article.content,
          article.category,
          article.author,
          article.author_role,
          article.image_url,
          article.featured,
          article.published,
        ]
      );
    }

    // Insert demo topics.
    for (const topic of TOPICS) {
      await conn.query(
        `INSERT INTO topics
          (title, slug, month_label, year, summary, description,
           activities, featured, published)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          topic.title,
          topic.slug,
          topic.month_label,
          topic.year,
          topic.summary,
          topic.description,
          typeof topic.activities === "string"
            ? topic.activities
            : JSON.stringify(topic.activities ?? []),
          topic.featured,
          topic.published,
        ]
      );
    }

    // Insert demo discussions and their replies.
    for (const discussion of DISCUSSIONS) {
      const [result] = await conn.query(
        `INSERT INTO discussions
          (title, type, body, author_name, author_email, campus,
           pinned, locked, created_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          discussion.title,
          discussion.type,
          discussion.body,
          discussion.author_name,
          discussion.author_email,
          discussion.campus,
          discussion.pinned,
          discussion.locked,
          new Date(discussion.created_at),
        ]
      );

      for (const reply of discussion.replies || []) {
        await conn.query(
          `INSERT INTO discussion_replies
            (discussion_id, author_name, body, created_at)
           VALUES (?, ?, ?, ?)`,
          [
            result.insertId,
            reply.author_name,
            reply.body,
            new Date(reply.created_at),
          ]
        );
      }
    }

    console.log("Seed complete.");
    console.log(
      "Admin email: nemmanuel@studentforliberty.org"
    );
    console.log(
      "The initial password is set in this script. Change it before public launch."
    );
  } finally {
    await conn.end();
  }
}

main().catch((error) => {
  console.error("Seed failed:", error.message);
  process.exitCode = 1;
});
