const express = require("express");
const { auth, product, category } = require("../controllers");
const { authToken } = require("../helper/token");
const { uploadSingle } = require("../helper/uploader");

const routes = express.Router();

// AUTH
routes.post("/login", auth.login);
routes.post("/keep-login", authToken, auth.keepLogin);

// PRODUCTS
routes.get("/products", product.all);
routes.post("/product", uploadSingle, product.add);

// CATEGORY
routes.get("/categories", category.all);

module.exports = routes;
