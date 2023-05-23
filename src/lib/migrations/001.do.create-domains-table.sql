CREATE TABLE domains (
  id INTEGER PRIMARY KEY,
  value TEXT NOT NULL UNIQUE,
  created_at INTEGER NOT NULL,
  updated_at INTEGER
);
