const authController = require("./authController");
const categoryController = require("./categoryController");
const productController = require("./productController");
const userController = require("./userController");

module.exports = {
  auth: authController,
  category: categoryController,
  product: productController,
  user: userController,
};
