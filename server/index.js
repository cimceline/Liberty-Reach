const path = require("path");
const fs = require("fs");
const express = require("express");
const cors = require("cors");
const db = require("./db");
const api = require("./routes/api");

const PORT = Number(process.env.PORT || 3001);
const DIST = path.join(__dirname, "..", "client", "dist");

async function main() {
  // tiny .env loader (no extra dependency)
  const envFile = path.join(__dirname, "..", ".env");
  if (fs.existsSync(envFile)) {
    for (const line of fs.readFileSync(envFile, "utf8").split(/\r?\n/)) {
      const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/i);
      if (m && process.env[m[1]] === undefined) process.env[m[1]] = m[2].replace(/^["']|["']$/g, "");
    }
  }

  await db.init();

  const app = express();
  app.use(cors());
  app.use(express.json({ limit: "1mb" }));

  app.use("/api", api);

  app.use(express.static(DIST));
  app.get("*", (req, res) => {
    res.sendFile(path.join(DIST, "index.html"));
  });

  // eslint-disable-next-line no-unused-vars
  app.use((err, req, res, next) => {
    console.error(err);
    res.status(500).json({ error: "Something went wrong on our side. Please try again." });
  });

  app.listen(PORT, () => {
    console.log(`Liberty Reach running at http://localhost:${PORT}  (db: ${db.getMode()})`);
  });
}

main().catch((e) => {
  console.error("Failed to start server:", e);
  process.exit(1);
});
