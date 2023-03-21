const db = require("../config/db");

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
