import express from "express";
import { createServer as createViteServer } from "vite";
import Database from "better-sqlite3";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const db = new Database("abayas.db");

// Initialize database
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE,
    name TEXT,
    xp INTEGER DEFAULT 0,
    level INTEGER DEFAULT 1,
    streak INTEGER DEFAULT 0,
    last_active DATE,
    is_premium INTEGER DEFAULT 0,
    premium_expires_at DATETIME,
    questions_count INTEGER DEFAULT 0,
    last_question_at DATETIME
  );

  CREATE TABLE IF NOT EXISTS challenges (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT,
    description TEXT,
    xp_reward INTEGER,
    type TEXT
  );

  CREATE TABLE IF NOT EXISTS notes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_email TEXT,
    title TEXT,
    content TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
  CREATE INDEX IF NOT EXISTS idx_users_xp ON users(xp DESC);
  CREATE INDEX IF NOT EXISTS idx_notes_user_email ON notes(user_email);
`);

// Seed some challenges if empty
const challengeCount = db.prepare("SELECT COUNT(*) as count FROM challenges").get() as { count: number };
if (challengeCount.count === 0) {
  const insert = db.prepare("INSERT INTO challenges (title, description, xp_reward, type) VALUES (?, ?, ?, ?)");
  insert.run("Morning Quiz", "Complete a 5-question AI quiz", 50, "quiz");
  insert.run("Code Debugger", "Fix a Python syntax error", 100, "coding");
  insert.run("Concept Master", "Explain 'Photosynthesis' to the AI", 75, "study");
}

async function startServer() {
  const app = express();
  app.use(express.json());
  const PORT = 3000;

  // API Routes
  app.get("/api/user/:email", (req, res) => {
    const { email } = req.params;
    let user = db.prepare("SELECT * FROM users WHERE email = ?").get(email) as any;
    if (!user) {
      db.prepare("INSERT INTO users (email, name) VALUES (?, ?)").run(email, email.split('@')[0]);
      user = db.prepare("SELECT * FROM users WHERE email = ?").get(email);
    }
    res.json(user);
  });

  app.post("/api/user/add-xp", (req, res) => {
    const { email, xp } = req.body;
    const user = db.prepare("SELECT * FROM users WHERE email = ?").get(email) as any;
    if (!user) return res.status(404).json({ error: "User not found" });

    const newXp = user.xp + xp;
    let newLevel = user.level;

    // Level thresholds: 2: 500, 3: 1000, 4: 2000, 5: 4000
    if (newXp >= 4000) newLevel = 5;
    else if (newXp >= 2000) newLevel = 4;
    else if (newXp >= 1000) newLevel = 3;
    else if (newXp >= 500) newLevel = 2;
    else newLevel = 1;

    let isPremium = user.is_premium;
    let premiumExpiresAt = user.premium_expires_at;

    // If reached level 5 and wasn't level 5 before
    if (newLevel >= 5 && user.level < 5) {
      isPremium = 1;
      const expiry = new Date();
      expiry.setDate(expiry.getDate() + 2);
      premiumExpiresAt = expiry.toISOString();
    }

    db.prepare("UPDATE users SET xp = ?, level = ?, is_premium = ?, premium_expires_at = ? WHERE email = ?")
      .run(newXp, newLevel, isPremium, premiumExpiresAt, email);
    
    const updatedUser = db.prepare("SELECT * FROM users WHERE email = ?").get(email);
    res.json(updatedUser);
  });

  app.post("/api/user/upgrade", (req, res) => {
    const { email } = req.body;
    db.prepare("UPDATE users SET is_premium = 1 WHERE email = ?").run(email);
    const updatedUser = db.prepare("SELECT * FROM users WHERE email = ?").get(email);
    res.json(updatedUser);
  });

  app.post("/api/user/check-usage", (req, res) => {
    const { email } = req.body;
    let user = db.prepare("SELECT * FROM users WHERE email = ?").get(email) as any;
    
    if (!user) return res.status(404).json({ error: "User not found" });
    
    if (user.is_premium) {
      if (user.premium_expires_at) {
        const expiry = new Date(user.premium_expires_at);
        if (expiry < new Date()) {
          // Premium expired
          db.prepare("UPDATE users SET is_premium = 0, premium_expires_at = NULL WHERE email = ?").run(email);
          user.is_premium = 0;
        } else {
          return res.json({ allowed: true, remaining: "Unlimited" });
        }
      } else {
        return res.json({ allowed: true, remaining: "Unlimited" });
      }
    }

    const now = new Date();
    const lastAt = user.last_question_at ? new Date(user.last_question_at) : null;
    const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000);

    let count = user.questions_count;
    if (!lastAt || lastAt < oneHourAgo) {
      count = 0;
    }

    if (count >= 20) {
      return res.json({ allowed: false, remaining: 0, resetIn: "1 hour" });
    }

    db.prepare("UPDATE users SET questions_count = ?, last_question_at = ? WHERE email = ?")
      .run(count + 1, now.toISOString(), email);
    
    res.json({ allowed: true, remaining: 20 - (count + 1) });
  });

  app.get("/api/leaderboard", (req, res) => {
    const topUsers = db.prepare("SELECT name, xp, level FROM users ORDER BY xp DESC LIMIT 50").all();
    res.json(topUsers);
  });

  app.get("/api/challenges", (req, res) => {
    const challenges = db.prepare("SELECT * FROM challenges").all();
    res.json(challenges);
  });

  // Notes API
  app.post("/api/notes", (req, res) => {
    const { email, title, content } = req.body;
    const result = db.prepare("INSERT INTO notes (user_email, title, content) VALUES (?, ?, ?)").run(email, title, content);
    res.json({ id: result.lastInsertRowid });
  });

  app.get("/api/notes/:email", (req, res) => {
    const { email } = req.params;
    const notes = db.prepare("SELECT * FROM notes WHERE user_email = ? ORDER BY created_at DESC").all(email);
    res.json(notes);
  });

  app.delete("/api/notes/:id", (req, res) => {
    const { id } = req.params;
    db.prepare("DELETE FROM notes WHERE id = ?").run(id);
    res.json({ success: true });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, "dist")));
    app.get("*", (req, res) => {
      res.sendFile(path.join(__dirname, "dist", "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
