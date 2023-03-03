const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => res.status(200).send("welcome"));

app.listen(2000, () => console.log("Api is running up..."));
