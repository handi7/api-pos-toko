const db = require("../config/db");

module.exports = {
  all: async (req, res) => {
    try {
      const query = `select * from category;`;

      const [result] = await db.execute(query);
      res.status(200).send({ data: result, error: false });
    } catch (error) {
      res.status(500).send(error);
    }
  },
};
