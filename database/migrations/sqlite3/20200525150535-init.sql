-- +migrate Up
CREATE TABLE users (
  id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
  
  email TEXT NOT NULL,
  password TEXT NOT NULL,
  salt TEXT NOT NULL,

  createdAt INTEGER NOT NULL,
  updatedAt INTEGER NOT NULL,
  deletedAt INTEGER,

  UNIQUE (email)
);
CREATE TABLE sessions (
  id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,

  key TEXT NOT NULL,
  data TEXT,

  userId INTEGER,

  createdAt INTEGER NOT NULL,
  updatedAt INTEGER NOT NULL,
  deletedAt INTEGER,

  FOREIGN KEY (userId) REFERENCES users (id)
);
CREATE TABLE activities (
  id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,

  file TEXT,
  name TEXT NOT NULL,
  startedAt INTEGER NOT NULL,
  createdWith TEXT,

  userId INTEGER NOT NULL,

  createdAt INTEGER NOT NULL,
  updatedAt INTEGER NOT NULL,
  deletedAt INTEGER,

  FOREIGN KEY (userId) REFERENCES users (id),
  UNIQUE (userId, file)
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
  FOREIGN KEY (userId) REFERENCES users (id)
);

-- +migrate Down
DROP TABLE users;
DROP TABLE sessions;
DROP TABLE activities;
DROP TABLE points;