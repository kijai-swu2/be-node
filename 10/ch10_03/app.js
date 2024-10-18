const express = require("express");
const postRoute = require("./routes/postRoute");
const authRoute = require("./routes/authRoute");
const models = require("./models");

const app = express();
app.use(express.json());
app.use("/posts", postRoute);
app.use("/auth", authRoute);

const PORT = 3000;
app.listen(PORT, () => {
  models.sequelize
    .sync({ force: false })
    .then(() => {
      console.log(`Listening to ${PORT}...`);
    })
    .catch((error) => {
      console.log(`Failed to connect to DB: ${error}`);
    });
  process.exit;
});
