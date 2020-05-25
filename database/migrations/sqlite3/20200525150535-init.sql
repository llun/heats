
-- +migrate Up
CREATE TABLE users (
  id            INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT
);

CREATE TABLE trackpoints (
	id            INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
  data          TEXT    NOT NULL,
  user_id       INTEGER NOT NULL,
  created_at    INTEGER NOT NULL,

  FOREIGN KEY (user_id) REFERENCES users (id)
);

-- +migrate Down
DROP TABLE users;
DROP TABLE trackpoints;