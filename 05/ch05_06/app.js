const express = require("express");
const cookieParser = require("cookie-parser");
const expressSession = require("express-session");

const app = express();
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(
  expressSession({
    secret: "sample",
    resave: true,
    saveUninitialized: true,
  })
);

app.set("view engine", "ejs");

const users = [
  { username: "admin", password: "admin1234" },
  { username: "test", password: "test1234" },
];

app.get("/login", (req, res) => {
  res.render("login");
});

app.post("/login", (req, res) => {
  const { username, password } = req.body;

  const isUser = users.filter((item) => {
    return item.username == username && item.password == password;
  });

  if (isUser.length > 0) {
    req.session.user = {
      username: username,
      authorized: true,
    };
    console.log(users);
    res.redirect("/home");
  } else {
    res.redirect("/login");
  }
});

app.get("/register", (req, res) => {
  res.render("register");
});

app.post("/register", (req, res) => {
  const { nickname, username, password } = req.body;

  const isUser = users.filter((item) => {
    return item.username == username && item.password == password;
  });

  if (isUser.length > 0) {
    console.error("ID already exists");
  } else {
    users.push({
      nickname: nickname,
      username: username,
      password: password,
    });
    console.log(users);
    res.redirect("/login");
  }
});

app.get("/home", (req, res) => {
  if (req.session.user) {
    res.render("home");
  } else {
    res.redirect("/login");
  }
});

app.get("/logout", (req, res) => {
  if (req.session.user) {
    req.session.user == null;
  }
  res.redirect("/login");
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log("Listening...");
});
