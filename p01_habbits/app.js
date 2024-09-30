console.clear();

const express = require("express");
const moment = require("moment");
const sqlite3 = require("sqlite3");
const path = require("path");

const app = express();
app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "assets")));
app.use(express.urlencoded({ extended: true }));

/* DB 세팅하기 */
const db_name = path.join(__dirname, "myHabbits.db");
const db = new sqlite3.Database(db_name);

const create_users = `
CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  userName VARCHAR(10),
  email VARCHAR(20),
  password VARCHAR(20),
  createdAt DATE
);`;

const create_habbits = `
CREATE TABLE IF NOT EXISTS habbits (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  userId INTEGER,
  habbitName VARCHAR(20),
  startsAt DATE,
  endsAt DATE,
  createdAt DATE,
  isDeleted BOOLEAN DEFAULT FALSE,
  FOREIGN KEY(userId) REFERENCES users(id)
);`;

const create_habbitRecords = `
CREATE TABLE IF NOT EXISTS habbitRecords (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  habbitId INTEGER,
  recordContent TEXT,
  createdAt DATE,
  isDeleted BOOLEAN DEFAULT FALSE,
  FOREIGN KEY(habbitId) REFERENCES habbits(id)
);`;

db.serialize(() => {
  db.run(create_users);
  db.run(create_habbits);
  db.run(create_habbitRecords);
});

app.get("/login", (req, res) => {
  res.render("login");
});

app.get("/register", (req, res) => {
  res.render("register");
});

app.post("/register", (req, res) => {
  const createdAt = moment().format("YYYY-MM-DD");

  let sql = `
    INSERT INTO users( userName, email, password, createdAt ) VALUES (
    '${req.body.userName}', '${req.body.email}', '${req.body.password}', '${createdAt}'
  );
  `;

  db.run(sql, (err) => {
    if (err) {
      res.status(500).send("Failed to register.");
    } else {
      console.log(sql);
      res.redirect("/login");
    }
  });
});

app.get("/habbit_list", (req, res) => {
  let sql = `
    SELECT * FROM habbits WHERE isDeleted = FALSE ORDER BY id DESC;
  `;

  db.all(sql, (err, rows) => {
    if (err) {
      res.status(500).send("Failed to load data.");
    } else {
      res.render("habbit_list", { habbits: rows });
    }
  });
});

app.get("/habbit_add", (req, res) => {
  res.render("habbit_add");
});

app.post("/habbit_add", (req, res) => {
  const createdAt = moment().format("YYYY-MM-DD");

  let sql = `
  INSERT INTO habbits( userId, habbitName, startsAt, endsAt, createdAt ) VALUES ( 1, '${req.body.habbitName}', '${req.body.startsAt}', '${req.body.endsAt}', '${createdAt}' )`;

  db.run(sql, (err) => {
    if (err) {
      console.log(sql);
      console.error(err.message);
      res.status(500).send("Failed to add a habbit.");
    } else {
      console.log(sql);
      res.redirect("/habbit_list");
    }
  });
});

app.get("/habbit_record_list/:id", (req, res) => {
  const id = req.params.id;

  let sql = `
    SELECT * FROM habbitRecords WHERE habbitId = ${id} AND isDeleted = FALSE ORDER BY id DESC;
  `;

  db.all(sql, (err, rows) => {
    if (err) {
      console.error(err.message);
    } else {
      res.render("habbit_record_list", { records: rows });
    }
  });
});

app.get("/habbit_record_add", (req, res) => {
  res.render("habbit_record_add");
});

app.post("/habbit_record_add", (req, res) => {});

const PORT = 3000;
app.listen(PORT, () => {
  console.log("Listening...");
});
