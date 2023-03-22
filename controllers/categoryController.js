const db = require("../config/db");

module.exports = {
  all: async (req, res) => {
    try {
      const query = `select * from category where is_deleted = false;`;

      const [result] = await db.execute(query);
      res.status(200).send({ data: result, error: false });
    } catch (error) {
      res.status(500).send(error);
    }
  },

  categoryData: async (req, res) => {
    try {
      const offset = req.query.offset || "0";
      const limit = req.query.limit || "10";
      const sort = req.query.sort || "label";
      const desc = req.query.desc;

      const countQuery = `select count(cat_id) count from category where is_deleted = false;`;
      const query = `select c.*, count(p.id) count from category c 
                  left join products p on c.cat_id = p.cat_id where c.is_deleted = false 
                  group by c.cat_id order by ${sort} ${desc ? "desc" : ""} 
                  limit ?,?;`;

      const [[{ count }]] = await db.execute(countQuery);
      const [data] = await db.execute(query, [offset, limit]);
      res.status(200).send({ data, count });
    } catch (error) {
      console.log(error);
      res.status(500).send(500);
    }
  },

  add: async (req, res) => {
    try {
      const query = `insert into category (label, value) values (?, ?);`;

      await db.execute(query, [req.body.label, req.body.value]);
      res.status(200).send(true);
    } catch (error) {
      console.log(error);
      res.status(500).send(error);
    }
  },

  update: async (req, res) => {
    try {
      const { cat_id, label, value } = req.body;
      const query = `update category set label = ?, value = ? where cat_id = ?;`;

      await db.execute(query, [label, value, cat_id]);
      res.status(200).send(true);
    } catch (error) {
      console.log(error);
      res.status(500).send(error);
    }
  },

  delete: async (req, res) => {
    try {
      const query = `update category set is_deleted = true where cat_id = ?;`;

      await db.execute(query, [req.params.id]);
      res.status(200).send(true);
    } catch (error) {
      res.status(500).send(error);
    }
  },
};
