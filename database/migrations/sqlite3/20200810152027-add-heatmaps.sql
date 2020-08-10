
-- +migrate Up
CREATE TABLE heatmaps (
  id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,

  userId INTEGER NOT NULL,
  
  filePath TEXT NOT NULL,

  createdAt INTEGER NOT NULL,
  updatedAt INTEGER NOT NULL,
  deletedAt INTEGER,

  FOREIGN KEY (userId) REFERENCES users(id)
);

-- +migrate Down
DROP TABLE heatmaps;