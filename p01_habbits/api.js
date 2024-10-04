console.clear();

const express = require("express");
const fs = require("fs");
const moment = require("moment");
const sqlite3 = require("sqlite3");
const path = require("path");

const app = express();
app.use(express.json());

// MARK : Get users
app.get("/users", (req, res) => {
  const users_sql = `
    SELECT *
    FROM users
  `;

  db.all(users_sql, (err, rows) => {
    if (err) {
      res.status(500).send(err.message);
    } else {
      res.json({ users: rows });
    }
  });
});

// MARK : Habbit list
app.get("/users/:userId/habbit", (req, res) => {
  const userId = req.params.userId;

  let habbit_list_sql = `
      SELECT
        ROW_NUMBER() OVER(ORDER BY id) AS rowId,
        *, 
        (SELECT COUNT(1) FROM habbitRecords r WHERE r.habbitID = h.id AND r.isDeleted = FALSE) records
      FROM habbits h
      WHERE h.userId = ${userId} AND h.isDeleted = FALSE
      ORDER BY h.id DESC
      ;`;

  db.all(habbit_list_sql, (err, rows) => {
    if (err) {
      res.status(500).send(`Failed to load data 1. ${err.message}`);
    } else {
      res.json({ habbits: rows });
    }
  });
});

// MARK : Habbit add
app.post("/users/:userId/habbit/add", (req, res) => {
  const { habbitName, startsAt, endsAt } = req.body;
  const userId = req.params.userId;
  let sql = `
  INSERT INTO habbits( userId, habbitName, startsAt, endsAt ) VALUES ( ${userId}, '${habbitName}', '${startsAt}', '${endsAt}' )`;

  db.run(sql, (err) => {
    if (err) {
      res.status(500).send(`Failed to add a habbit: ${err.message}`);
    } else {
      res.redirect(`/users/${userId}/habbit`);
    }
  });
});

// MARK : Habbit delete
app.get("/users/:userId/habbit/delete/:habbitId", (req, res) => {
  const userId = req.params.userId;
  const habbitId = req.params.habbitId;

  let delete_records_sql = `
    UPDATE habbitRecords SET isDeleted = TRUE WHERE habbitId = ?
  ;`;

  db.run(delete_records_sql, [habbitId], (err) => {
    if (err) {
      res.status(500).send(`Failed to delete. ${err.message}`);
    } else {
      let delete_habbit_sql = `
        UPDATE habbits SET isDeleted = TRUE WHERE id = ?
      ;`;

      db.run(delete_habbit_sql, [habbitId], (err) => {
        res.redirect(`/users/${userId}/habbit`);
      });
    }
  });
});

// MARK : Habbit record list
app.get("/users/:userId/habbit/:habbitId", (req, res) => {
  const habbitId = req.params.habbitId;

  let sql = `
    SELECT
      *,
      ROW_NUMBER() OVER(ORDER BY habbitID) AS rowID
    FROM habbitRecords
    WHERE habbitId = ? AND isDeleted = FALSE
    ORDER BY id DESC
    ;`;

  db.all(sql, [habbitId], (err, rows) => {
    if (err) {
      res.status(500).send(`Failed to load the data: ${err.message};`);
    } else {
      db.get(`SELECT COUNT(*) AS count FROM habbitRecords WHERE habbitId = ${habbitId} AND isDeleted = FALSE;`, (err, row) => {
        if (err) {
          res.status(500).send(`Failed to calculate the page: ${err.message};`);
        } else {
          console.log(sql);
          res.json({ habbitRecords: rows });
        }
      });
    }
  });
});

// MARK : Habbit record add
app.post("/users/:userId/habbit/:habbitId/record/add", (req, res) => {
  const userId = req.params.userId;
  const habbitId = req.params.habbitId;
  const { recordContent } = req.body;

  let sql = `INSERT INTO habbitRecords(habbitId, recordContent) VALUES ( ?, ? );`;

  db.run(sql, [habbitId, recordContent], (err) => {
    if (err) {
      res.status(500).send(err.message);
    } else {
      console.log(sql);
      res.redirect(`/users/${userId}/habbit/${habbitId}`);
    }
  });
});

// MARK : DB 세팅하기
const db_name = path.join(__dirname, "myHabbits.db");
const db = new sqlite3.Database(db_name);

// MARK : Server setting
const PORT = 3001;
app.listen(PORT, () => {
  console.log("Listening...");
});
