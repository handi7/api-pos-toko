const express = require("express");
const { auth } = require("../controllers");
const { authToken } = require("../helper/token");

const routes = express.Router();

routes.post("/login", auth.login);
routes.post("/keep-login", authToken, auth.keepLogin);

module.exports = routes;
