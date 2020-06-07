-- +migrate Up
CREATE TABLE users (
  id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
  
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL,
  deleted_at INTEGER
);
CREATE TABLE activities (
  id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,

  timestamp INTEGER NOT NULL,

  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL,
  deleted_at INTEGER
);
CREATE TABLE points (
  id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,

  latitude REAL NOT NULL,
  longitude REAL NOT NULL,
  altitude REAL NOT NULL,

  data TEXT,
  timestamp INTEGER NOT NULL,

  activity_id INTEGER NOT NULL,
  user_id INTEGER NOT NULL,

  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL,
  deleted_at INTEGER,

  FOREIGN KEY (activity_id) REFERENCES activities (id),
  FOREIGN KEY (user_id) REFERENCES users (id),
  UNIQUE (latitude, longitude, timestamp)
);
INSERT INTO users (id, created_at, updated_at, deleted_at) VALUES (1, 1591424156687, 1591424156687, null);

-- +migrate Down
DROP TABLE users;
DROP TABLE activities;
DROP TABLE points;