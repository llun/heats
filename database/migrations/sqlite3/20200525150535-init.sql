
-- +migrate Up
CREATE TABLE users (
  id            INTEGER PRIMARY KEY
);

CREATE TABLE trackpoints (
	id            INTEGER PRIMARY KEY,
  latitude      REAL    NOT NULL,
  longitude     REAL    NOT NULL,
  elevation     REAL    NOT NULL,
  timestamp     INTEGER NOT NULL,

  user_id       INTEGER NOT NULL,

  created_at    INTEGER NOT NULL,

  FOREIGN KEY (user_id) REFERENCES users (id)
);

-- +migrate Down
DROP TABLE users;
DROP TABLE trackpoints;