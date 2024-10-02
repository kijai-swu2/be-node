console.clear();

const express = require("express");
const moment = require("moment");
const sqlite3 = require("sqlite3");
const path = require("path");

const app = express();
app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "assets")));
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));

// MARK : DB 세팅하기
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

// MARK : Login
app.get("/login", (req, res) => {
  res.render("login");
});

// MARK : Register
app.get("/register", (req, res) => {
  res.render("register");
});

app.post("/register", (req, res) => {
  const createdAt = moment().format("YYYY-MM-DD");

  const { userName, email, password } = req.body;
  const email_check_sql = `SELECT COUNT(1) AS count FROM users WHERE email = '${"email"};`;

  db.get(email_check_sql, (err, row) => {
    if (err) {
      res.status(500).send(err.message);
    }
    if (row.count > 0) {
      res.status(200).send("Email already exist.");
    } else {
      const insert_user_sql = `
        INSERT INTO users( userName, email, password, createdAt ) VALUES (
        '${req.body.userName}', '${req.body.email}', '${req.body.password}', '${createdAt}'
      );`;
      db.run(insert_user_sql, (err) => {
        if (err) {
          res.status(500).send("Failed to register.");
        } else {
          console.log(insert_user_sql);
          res.redirect("/login");
        }
      });
    }
  });
});

// MARK : Habbit
app.get("/habbit", (req, res) => {
  let sql = `
    SELECT *, (SELECT COUNT(1) FROM habbitRecords r WHERE r.habbitID = h.id AND r.isDeleted = FALSE) records
    FROM habbits h
    WHERE h.isDeleted = FALSE
    ORDER BY h.id DESC;
    `;

  db.all(sql, (err, rows) => {
    if (err) {
      res.status(500).send(`Failed to load data. ${err.message}`);
    } else {
      res.render("habbit_list", { habbits: rows });
    }
  });
});

// MARK : Habbit add
app.get("/habbit/add", (req, res) => {
  res.render("habbit_add");
});

app.post("/habbit/add", (req, res) => {
  const createdAt = moment().format("YYYY-MM-DD");

  let sql = `
  INSERT INTO habbits( userId, habbitName, startsAt, endsAt, createdAt ) VALUES ( 1, '${req.body.habbitName}', '${req.body.startsAt}', '${req.body.endsAt}', '${createdAt}' )`;

  db.run(sql, (err) => {
    console.log(sql);
    if (err) {
      console.error(err.message);
      res.status(500).send("Failed to add a habbit.");
    } else {
      console.log(sql);
      res.redirect("/habbit");
    }
  });
});

// MARK : Habbit delete
app.get("/habbit/delete/:id", (req, res) => {
  const id = req.params.id;

  let delete_sql = `
    UPDATE habbits SET isDeleted = TRUE WHERE id = ${id}
  `;

  db.run(delete_sql, (err) => {
    if (err) {
      res.status(500).send(`Failed to delete. ${err.message}`);
    } else {
      res.redirect("/habbit");
    }
  });
});

// MARK : Habbit record
app.get("/habbit/:habbitId", (req, res) => {
  const habbitId = req.params.habbitId;

  let sql = `
    SELECT * FROM habbitRecords WHERE habbitId = ${habbitId} AND isDeleted = FALSE ORDER BY id DESC;
  `;

  db.all(sql, (err, rows) => {
    if (err) {
      console.error(err.message);
    } else if (rows.length == 0) {
      res.redirect(`/habbit/${habbitId}/record/add`);
    } else {
      res.render("habbit_record_list", { records: rows });
    }
  });
});

// MARK : Habbit add
app.get("/habbit/:habbitId/record/add", (req, res) => {
  const habbitId = req.params.habbitId;
  res.render("habbit_record_add", { habbitId });
});

app.post("/habbit/:habbitId/record/add", (req, res) => {
  const habbitId = req.params.habbitId;
  const createdAt = moment().format("YYYY-MM-DD");

  let sql = `INSERT INTO habbitRecords(habbitId, recordContent, createdAt) VALUES (${habbitId}, '${req.body.recordContent}', '${createdAt}');`;

  db.run(sql, (err) => {
    if (err) {
      res.status(500).send(err.message);
    } else {
      res.redirect(`/habbit/${habbitId}`);
    }
  });
});

// MARK : Habbit delete
app.get("/habbit/:habbitId/record/delete/:id", (req, res) => {
  const habbitId = req.params.habbitId;
  const id = req.params.id;

  // 삭제 후 결과가 0개면 습관 목록으로, 1개 이상이면 습관 기록 목록으로 보내기
  let select_sql = `SELECT COUNT(1) AS count FROM habbitRecords WHERE habbitID = ${habbitId} AND isDeleted = FALSE;`;

  db.get(select_sql, (err, rows) => {
    if (err) {
      res.status(500).send(err.message);
    }
    let delete_sql = `UPDATE habbitRecords SET isDeleted = TRUE WHERE id = ${id};`;
    db.run(delete_sql, (err) => {
      if (err) {
        res.status(500).send(err.message);
      } else {
        rows.count > 1 ? res.redirect(`/habbit/${habbitId}`) : res.redirect(`/habbit`);
      }
    });
  });
});

// MARK : Server setting
const PORT = 3000;
app.listen(PORT, () => {
  console.log("Listening...");
});
