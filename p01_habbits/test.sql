CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  userName VARCHAR(10),
  password VARCHAR(20),
  createdAt date
);

CREATE TABLE IF NOT EXISTS habbits (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  userId FOREIGN KEY(id) REFERENCES users,
  habbitName VARCHAR(20),
  startsAt date,
  endsAt date,
  createdAt date
);

CREATE TABLE IF NOT EXISTS habbitRecords (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  habbitId FOREIGN KEY(id) REFERENCES habbits(id),
  recordContent text,
  createdAt date
);

INSERT INTO users( userName, password, createdAt ) VALUES (
  '${req.body.userName}', '${req.body.password}', '${createdAt}'
)

SELECT * FROM habbits WHERE isDeleted != FALSE;


INSERT INTO habbits( userId, habbitName, startsAt, endsAt, createdAt ) VALUES (
  1, '${req.body.habbitName}', '${req.body.startsAt}', '${createdAt}'
)


SELECT * FROM habbits WHERE id = id;

INSERT INTO habbitRecords(habbitId, recordContent, createdAt) VALUES (1, '첫 번째 성공', '${createdAt}');