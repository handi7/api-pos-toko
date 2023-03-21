const express = require("express");
const { auth, product, category, user } = require("../controllers");
const { authToken } = require("../helper/token");
const { uploadSingle } = require("../helper/uploader");

const routes = express.Router();

// AUTH
routes.post("/login", auth.login);
routes.post("/keep-login", authToken, auth.keepLogin);

// PRODUCTS
routes.get("/products", product.all);
routes.post("/product", uploadSingle, product.add);
routes.patch("/product", uploadSingle, product.update);
routes.delete("/product/:id", product.delete);

// CATEGORY
routes.get("/categories", category.all);

// USERS
routes.get("/users", authToken, user.all);
routes.post("/user", authToken, user.add);
routes.patch("/user", authToken, user.update);

module.exports = routes;
