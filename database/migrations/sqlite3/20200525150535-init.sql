-- +migrate Up
CREATE TABLE users (
  id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
  
  createdAt INTEGER NOT NULL,
  updatedAt INTEGER NOT NULL,
  deletedAt INTEGER
);
CREATE TABLE activities (
  id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,

  name TEXT NOT NULL,
  startedAt INTEGER NOT NULL,
  createdWith TEXT,

  userId INTEGER NOT NULL,

  createdAt INTEGER NOT NULL,
  updatedAt INTEGER NOT NULL,
  deletedAt INTEGER,

  FOREIGN KEY (userId) REFERENCES users (id)
);
CREATE TABLE points (
  id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,

  latitude REAL NOT NULL,
  longitude REAL NOT NULL,
  altitude REAL NOT NULL,

  data TEXT,
  timestamp INTEGER NOT NULL,

  activityId INTEGER NOT NULL,
  userId INTEGER NOT NULL,

  createdAt INTEGER NOT NULL,
  updatedAt INTEGER NOT NULL,
  deletedAt INTEGER,

  FOREIGN KEY (activityId) REFERENCES activities (id),
  FOREIGN KEY (userId) REFERENCES users (id),
  UNIQUE (latitude, longitude, timestamp)
);
INSERT INTO users (id, createdAt, updatedAt, deletedAt) VALUES (1, 1591424156687, 1591424156687, null);

-- +migrate Down
DROP TABLE users;
DROP TABLE activities;
DROP TABLE points;