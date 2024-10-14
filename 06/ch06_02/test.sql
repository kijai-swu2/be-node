CREATE TABLE IF NOT EXISTS posts(
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title VARCHAR(255),
  content TEXT,
  author VARCHAR(100),
  createAt DATETIME DEFAULT current_timestamp,
  count INT DEFAULT 0,
  isDeleted BOOLEAN DEFAULT FALSE
);

SELECT *
FROM posts
WHERE isDeleted = FALSE;

INSERT INTO posts(title, content, author) VALUES (?, ?, ?);

UPDATE posts
SET title = title, content = content, author = author
WHERE id = id;