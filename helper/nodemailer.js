const nodemailer = require("nodemailer");
const dotenv = require("dotenv");
const path = require("path");

dotenv.config();

module.exports = {
  transporter: nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL,
      pass: process.env.MAILER_PASS,
    },
    tls: {
      rejectUnauthorized: false,
    },
  }),

  handlebarOptions: {
    viewEngine: {
      partialsDir: path.resolve("./helper/handlebars/"),
      defaultLayout: false,
    },
    viewPath: path.resolve("./helper/handlebars/"),
  },
};
