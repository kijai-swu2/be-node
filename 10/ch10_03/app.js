const express = require("express");
const postRoute = require("./routes/postRoute");
const models = require("./models");

const app = express();
app.use(express.json());
app.use("/posts", postRoute);

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
