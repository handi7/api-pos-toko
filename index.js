const express = require("express");
const cors = require("cors");
const routes = require("./routes");
const bearerToken = require("express-bearer-token");

const app = express();

app.use(cors());
app.use(express.json());
app.use(bearerToken());

app.get("/", (req, res) => res.status(200).send("welcome"));

app.use("/", routes);

app.listen(2000, () => console.log("Api is running up..."));
