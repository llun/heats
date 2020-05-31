-- +migrate Up
CREATE TABLE users (
  id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT
);
CREATE TABLE points (
  id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
  latitude REAL NOT NULL,
  longitude REAL NOT NULL,
  altitude REAL NOT NULL,
  data TEXT,
  timestamp INTEGER NOT NULL,
  user_id INTEGER NOT NULL,
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL,
  deleted_at INTEGER,
  FOREIGN KEY (user_id) REFERENCES users (id),
  UNIQUE (latitude, longitude, timestamp)
);
-- +migrate Down
DROP TABLE users;
DROP TABLE points;