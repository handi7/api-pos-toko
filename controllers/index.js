const authController = require("./authController");
const categoryController = require("./categoryController");
const productController = require("./productController");

module.exports = {
  auth: authController,
  product: productController,
  category: categoryController,
};
