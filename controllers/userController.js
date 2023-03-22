const db = require("../config/db");
const { transporter, handlebarOptions } = require("../helper/nodemailer");
const hbs = require("nodemailer-express-handlebars");
const { generatePassword, hash } = require("../helper/password");
const { createToken } = require("../helper/token");

module.exports = {
  all: async (req, res) => {
    try {
      const offset = req.query.offset || "0";
      const limit = req.query.limit || "10";
      const key = req.query.key;
      const sort = req.query.sort || "name";
      const asc = req.query.asc;

      const countQuery = `select count(id) count from users 
                ${
                  key
                    ? `where name like '${key}%' or email like '${key}%' or username like '${key}%'`
                    : ""
                };`;
      const query = `select id, username, email, name, role, is_verified, is_active, password_updated, created_at from users 
                ${
                  key
                    ? `where name like '${key}%' or email like '${key}%' or username like '${key}%'`
                    : ""
                }
                ${
                  sort ? `order by ${sort} ${asc ? "" : "desc"}` : ""
                } limit ?,?;`;

      const [[{ count }]] = await db.execute(countQuery);
      const [data] = await db.execute(query, [offset, limit]);
      res.status(200).send({ data, count });
    } catch (error) {
      res.status(500).send(error);
    }
  },

  add: async (req, res) => {
    try {
      const checkQuery = `select email from users where email = ?;`;
      const query = `insert into users (name, username, email, password, role) values(?, ?, ?, ?, ?);`;

      const [[user]] = await db.execute(checkQuery, [req.body.email]);
      if (user?.email) {
        return res.status(409).send({ message: "Email already registered" });
      }

      const username = req.body.name.toLowerCase() + Date.now();
      const generated = generatePassword(8);
      const password = hash(generated);
      const role = req.body.role || "kasir";
      const [result] = await db.execute(query, [
        req.body.name.toLowerCase(),
        username,
        req.body.email.toLowerCase(),
        password,
        role,
      ]);

      if (result.insertId) {
        const date = Date.now();
        const token = createToken(
          { id: result.insertId, email: req.body.email, date },
          "12h"
        );
        const verify_url = `http://localhost:3000/verify/${token}`;
        const mail = {
          from: `POS-TOKO <handev.co@gmail.com>`,
          to: `${req.body.email}`,
          subject: `Verifikasi Email`,
          template: "verify",
          context: { name: req.body.name, verify_url, generated },
        };

        transporter.use("compile", hbs(handlebarOptions));
        transporter.sendMail(mail);
        res.status(200).send(true);
      }
    } catch (error) {
      console.log(error);
      res.status(500).send(error);
    }
  },

  update: async (req, res) => {
    try {
      const esc = ["id", "password", "password_updated", "created_at"];
      let val = "";

      for (const key in req.body) {
        if (!esc.includes(key)) {
          if (val) val += ", ";
          val += `${key} = ${req.body[key]}`;
        }
      }
      const updateQuery = `update users set ${val} where id = ?;`;

      await db.execute(updateQuery, [req.body.id]);
      res.status(200).send(true);
    } catch (error) {
      res.status(500).send(error);
    }
  },
};
