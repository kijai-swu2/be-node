console.clear();

const express = require("express");
const moment = require("moment");
const sqlite3 = require("sqlite3");
const path = require("path");
const cookieParser = require("cookie-parser");
const expressSession = require("express-session");

const app = express();
app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "assets")));
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
  expressSession({
    secret: "habit",
    resave: true,
    saveUninitialized: true,
  })
);

// MARK : DB 세팅하기
const db_name = path.join(__dirname, "myHabbits.db");
const db = new sqlite3.Database(db_name);

const create_users = `
CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  userName VARCHAR(10),
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

app.post("/login", (req, res) => {
  const { userName, password } = req.body;

  // 로그인 정보 및 id를 세션에 함께 저장하기
  const authentication_sql = `
    SELECT id, COUNT(1) AS count
    FROM users
    WHERE userName = '${userName}' AND password = '${password}'
    ;`;
  db.get(authentication_sql, (err, row) => {
    if (err) {
      res.status(500).send(`DB Error: ${err.message}`);
    } else if (row.count > 0) {
      req.session.user = {
        id: `${row.id}`,
        userName: userName,
        authorized: true,
      };
      res.redirect("/habbit");
    } else {
      res.redirect("/login");
    }
  });
});

// MARK : Register
app.get("/register", (req, res) => {
  res.render("register");
});

app.post("/register", (req, res) => {
  const createdAt = moment().format("YYYY-MM-DD");

  const { userName, password } = req.body;
  const userName_check_sql = `SELECT COUNT(1) AS count FROM users WHERE userName = '${userName}';`;

  db.get(userName_check_sql, (err, row) => {
    if (err) {
      res.status(500).send(err.message);
    }
    if (row.count > 0) {
      res.status(200).send("ID already exist.");
    } else {
      const insert_user_sql = `
        INSERT INTO users( userName, password, createdAt ) VALUES (
        '${req.body.userName}', '${req.body.password}', '${createdAt}'
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

app.get("/logout", (req, res) => {
  if (req.session.user) {
    req.session.user == null;
  }
  res.redirect("/login");
});

// MARK : Habbit
app.get("/habbit", (req, res) => {
  let page = req.query.page ? parseInt(req.query.page) : 1;
  const limit = 5;
  const offset = (page - 1) * limit;

  if (req.session.user) {
    const userId = req.session.user["id"];
    let habbit_list_sql = `
      SELECT
        ROW_NUMBER() OVER(ORDER BY id) AS rowId,
        *, 
        (SELECT COUNT(1) FROM habbitRecords r WHERE r.habbitID = h.id AND r.isDeleted = FALSE) records
      FROM habbits h
      WHERE h.userId = ? AND h.isDeleted = FALSE
      ORDER BY h.id DESC
      LIMIT ? OFFSET ?
      ;`;
    db.all(habbit_list_sql, [userId, limit, offset], (err, rows) => {
      if (err) {
        res.status(500).send(`Failed to load data 1. ${err.message}`);
      } else {
        db.get(`SELECT COUNT(1) AS count FROM habbits WHERE userId = '${userId}' AND isDeleted = FALSE`, (err, row) => {
          if (err) {
            res.status(500).send(`Failed to load data 2. ${err.message}`);
          } else {
            const total = row.count;
            const totalPage = Math.ceil(total / limit);
            res.render("habbit_list", {
              habbits: rows,
              currentPage: page,
              totalPage: totalPage,
            });
          }
        });
      }
    });
  } else {
    res.redirect("/login");
  }
});

// MARK : Habbit add
app.get("/habbit/add", (req, res) => {
  if (req.session.user) {
    console.log(req.session.user);
    res.render("habbit_add");
  } else {
    res.redirect("/login");
  }
});

app.post("/habbit/add", (req, res) => {
  console.log(req.session.user);
  const userId = req.session.user["id"];
  const { habbitName, startsAt, endsAt } = req.body;
  const createdAt = moment().format("YYYY-MM-DD");

  let sql = `
  INSERT INTO habbits( userId, habbitName, startsAt, endsAt, createdAt ) VALUES ( ${userId}, '${habbitName}', '${startsAt}', '${endsAt}', '${createdAt}' )`;

  db.run(sql, (err) => {
    console.log(sql);
    if (err) {
      res.status(500).send(`Failed to add a habbit: ${err.message}`);
    } else {
      console.log(sql);
      res.redirect("/habbit");
    }
  });
});

// MARK : Habbit edit
app.get("/habbit/:id/edit", (req, res) => {
  const id = req.params.id;

  let select_sql = `
    SELECT *
    FROM habbits
    WHERE id = ${id};
  `;
  if (req.session.user) {
    db.get(select_sql, (err, row) => {
      if (err) {
        res.status(500).send(`Failed to load a habbit: ${err.message}`);
      } else {
        console.log(row);
        res.render("habbit_edit", { habbit: row });
      }
    });
  } else {
    res.redirect("/login");
  }
});

app.post("/habbit/:id/edit", (req, res) => {
  console.log(req.session.user);
  const userId = req.session.user["id"];
  const habbitId = req.params.id;

  let update_sql = `
  UPDATE habbits
  SET habbitName = '${req.body.habbitName}',
    startsAt = '${req.body.startsAt}',
    endsAt = '${req.body.endsAt}'
  WHERE id = ${habbitId}
  ;`;

  db.run(update_sql, (err) => {
    console.log(update_sql);
    if (err) {
      console.error(err.message);
      res.status(500).send("Failed to edit a habbit.");
    } else {
      res.redirect("/habbit");
    }
  });
});

// MARK : Habbit delete
app.get("/habbit/delete/:id", (req, res) => {
  const id = req.params.id;

  let delete_records_sql = `
    UPDATE habbitRecords SET isDeleted = TRUE WHERE habbitId = ?
  ;`;

  db.run(delete_records_sql, [id], (err) => {
    if (err) {
      res.status(500).send(`Failed to delete. ${err.message}`);
    } else {
      let delete_habbit_sql = `
        UPDATE habbits SET isDeleted = TRUE WHERE id = ?
      ;`;

      db.run(delete_habbit_sql, [id], (err) => {
        res.redirect("/habbit");
      });
    }
  });
});

// MARK : Habbit record
app.get("/habbit/:habbitId", (req, res) => {
  const habbitId = req.params.habbitId;
  const page = req.query.page ? parseInt(req.query.page) : 1;
  const limit = 5;
  const offset = (page - 1) * limit;

  let sql = `
    SELECT
      *,
      ROW_NUMBER() OVER(ORDER BY habbitID) AS rowID
    FROM habbitRecords
    WHERE habbitId = ? AND isDeleted = FALSE
    ORDER BY id DESC
    LIMIT ? OFFSET ?
    ;`;

  db.all(sql, [habbitId, limit, offset], (err, rows) => {
    if (err) {
      console.error(err.message);
    } else if (rows.length == 0) {
      res.redirect(`/habbit/${habbitId}/record/add`);
    } else {
      db.get(`SELECT COUNT(*) AS count FROM habbitRecords WHERE habbitId = ${habbitId} AND isDeleted = FALSE;`, (err, row) => {
        if (err) {
          res.status(500).send(`Failed to calculate the page: ${err.message};`);
        } else {
          const total = row.count;
          const totalPage = Math.ceil(total / limit);
          console.log(total, page, totalPage);
          console.log(`SELECT COUNT(*) AS count FROM habbitRecords WHERE habbitId = ${habbitId} AND isDeleted = FALSE;`);
          res.render("habbit_record_list", {
            records: rows,
            currentPage: page,
            totalPage: totalPage,
          });
        }
      });
    }
  });
});

// MARK : Habbit record add
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

// MARK : Habbit record delete
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
