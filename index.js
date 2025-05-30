const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config();

const connectDB = require("./config/dbconnection");
const routes = require("./routes/routes");

connectDB();

app.use(cors());
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/views/index.html");
});

app.use(routes);

// Start server
const listener = app.listen(process.env.PORT || 3000, () => {
  console.log("Your app is listening on port " + listener.address().port);
});
