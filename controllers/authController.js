const db = require("../config/db");
const { compare } = require("../helper/password");
const { createToken } = require("../helper/token");

module.exports = {
  login: async (req, res) => {
    try {
      const query = `select * from users where email = ?;`;
      const [[user]] = await db.execute(query, [req.body.email]);

      if (!user) {
        return res
          .status(404)
          .send({ data: null, error: "Email tidak terdaftar" });
      }

      if (!compare(req.body.password, user?.password)) {
        return res.status(401).send({
          data: null,
          error: "Password salah.",
        });
      }

      if (!user?.is_verified) {
        return res.status(401).send({
          data: null,
          error:
            "Email anda belum terverifikasi. Silahkan verifikasi email anda terlebih dahulu sebelum login.",
        });
      }

      if (!user?.is_active) {
        return res.status(401).send({
          data: null,
          error:
            "Akun anda dinonaktifkan. Silahkan hubungi admin untuk keterangan lebih lanjut.",
        });
      }

      delete user.password;
      const date = Date.now();
      const token =
        "Bearer " + createToken({ id: user.id, email: user.email, date }, "7d");

      res.status(200).send({ data: user, token, error: false });
    } catch (error) {
      console.log(error);
      res.status(500).send(error);
    }
  },

  keepLogin: async (req, res) => {
    try {
      const { id, email } = req.decoded;
      const query = `select id, email from users where id = ? and email = ?;`;

      const [[data]] = await db.execute(query, [id, email]);

      const date = Date.now();
      const token = "Bearer " + createToken({ id, email, date }, "7d");

      res.status(200).send({ data, token, error: false });
    } catch (error) {
      console.log(error);
      res.status(500).send(error);
    }
  },
};
