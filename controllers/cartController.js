const db = require("../config/db");

module.exports = {
  getByUserId: async (req, res) => {
    try {
      const query = `select c.*, name, price, img_url, description, unit, stock from cart c left join products p on c.product_id = p.id where user_id = ?;`;

      const [result] = await db.execute(query, [req.params.userId]);
      res.status(200).send(result);
    } catch (error) {
      res.status(500).send(error);
    }
  },

  add: async (req, res) => {
    try {
      const { user_id, product_id, qty } = req.body;
      const checkQuery = `select * from cart where user_id = ? and product_id = ?;`;
      const updateQuery = `update cart set qty = ? where id = ?;`;
      const insertQuery = `insert into cart (user_id, product_id, qty) values (?, ?, ?);`;

      const [[item]] = await db.execute(checkQuery, [user_id, product_id]);

      if (item) {
        await db.execute(updateQuery, [qty + item?.qty, item?.id]);
      } else {
        await db.execute(insertQuery, [user_id, product_id, qty]);
      }

      res.status(200).send(true);
    } catch (error) {
      res.status(500).send(error);
    }
  },

  update: async (req, res) => {
    try {
      const { id, qty } = req.body;
      const query = `update cart set qty = ? where id = ?;`;
      await db.execute(query, [qty, id]);
      res.status(200).send(true);
    } catch (error) {
      res.status(500).send(error);
    }
  },

  delete: async (req, res) => {
    try {
      const query = `delete from cart where id = ?;`;
      await db.execute(query, [req.params.id]);
      res.status(200).send(true);
    } catch (error) {
      res.status(500).send(error);
    }
  },
};
