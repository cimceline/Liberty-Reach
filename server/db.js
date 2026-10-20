
const fs = require("fs");
const path = require("path");

let pool = null;
let mode = "json";

const DATA_FILE = path.join(__dirname, "data.json");

const emptyData = {
  admins: [],
  articles: [],
  topics: [],
  discussions: [],
  discussion_replies: [],
  messages: [],
  subscribers: [],
};

function loadJson() {
  if (!fs.existsSync(DATA_FILE)) {
    fs.writeFileSync(DATA_FILE, JSON.stringify(emptyData, null, 2));
  }

  try {
    const saved = JSON.parse(fs.readFileSync(DATA_FILE, "utf8"));
    return { ...emptyData, ...saved };
  } catch (error) {
    console.error("[db] Failed to read JSON database:", error.message);
    return { ...emptyData };
  }
}

function saveJson(data) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
}

async function init() {
  if (process.env.DB === "mysql") {
    if (!process.env.MYSQL_HOST) {
      throw new Error("MYSQL_HOST environment variable is missing.");
    }

    if (!process.env.MYSQL_USER) {
      throw new Error("MYSQL_USER environment variable is missing.");
    }

    if (!process.env.MYSQL_PASSWORD) {
      throw new Error("MYSQL_PASSWORD environment variable is missing.");
    }

    if (!process.env.MYSQL_CA_CERT) {
      throw new Error("MYSQL_CA_CERT environment variable is missing.");
    }

    const mysql = require("mysql2/promise");

    pool = mysql.createPool({
      host: process.env.MYSQL_HOST,
      port: Number(process.env.MYSQL_PORT || 19655),
      user: process.env.MYSQL_USER,
      password: process.env.MYSQL_PASSWORD,
      database: process.env.MYSQL_DB || "defaultdb",
      ssl: {
        ca: process.env.MYSQL_CA_CERT,
        rejectUnauthorized: true,
      },
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
    });

    try {
      await pool.query("SELECT 1");
      mode = "mysql";
      console.log("[db] Connected to MySQL successfully.");
    } catch (error) {
      await pool.end().catch(() => {});
      pool = null;
      throw new Error(
        `MySQL connection failed: ${error.message}`
      );
    }

    return;
  }

  mode = "json";
  loadJson();
  console.log("[db] Using JSON database:", DATA_FILE);
}

function getMode() {
  return mode;
}

function getPool() {
  if (mode !== "mysql" || !pool) {
    throw new Error("MySQL database is not initialized.");
  }

  return pool;
}

async function query(sql, params = []) {
  const connection = getPool();
  const [rows] = await connection.execute(sql, params);
  return rows;
}

async function execute(sql, params = []) {
  const connection = getPool();
  const [result] = await connection.execute(sql, params);
  return result;
}

module.exports = {
  init,
  getMode,
  getPool,
  query,
  execute,
  loadJson,
  saveJson,
};
