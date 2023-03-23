const authController = require("./authController");
const cartController = require("./cartController");
const categoryController = require("./categoryController");
const productController = require("./productController");
const userController = require("./userController");

module.exports = {
  auth: authController,
  cart: cartController,
  category: categoryController,
  product: productController,
  user: userController,
};
