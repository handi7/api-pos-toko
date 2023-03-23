const express = require("express");
const { auth, product, category, user, cart } = require("../controllers");
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
routes.get("/category-data", category.categoryData);
routes.post("/category", authToken, category.add);
routes.patch("/category", authToken, category.update);
routes.delete("/category/:id", authToken, category.delete);

// USERS
routes.get("/users", authToken, user.all);
routes.post("/user", authToken, user.add);
routes.patch("/user", authToken, user.update);

// CART
routes.get("/cart/:userId", authToken, cart.getByUserId);
routes.post("/cart", authToken, cart.add);
routes.patch("/cart", authToken, cart.update);
routes.delete("/cart/:id", authToken, cart.delete);

module.exports = routes;
