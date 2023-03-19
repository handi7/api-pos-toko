const db = require("../config/db");
const {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} = require("firebase/storage");
const { storage } = require("../config/fire");

module.exports = {
  all: async (req, res) => {
    try {
      const offset = req.query.offset || "0";
      const limit = req.query.limit || "10";
      const key = req.query.key;
      const cat = req.query.cat;
      const sort = req.query.sort;
      const asc = req.query.asc;

      const countQuery = `select count(id) total from products where is_deleted = false 
                ${
                  key || cat
                    ? `and ${key ? `name like '${key}%'` : ""}
                ${cat ? ` ${key ? "and " : ""}cat_id = ${cat}` : ""}`
                    : ""
                };`;
      const query = `select p.*, c.label from products p left join category c on p.cat_id = c.cat_id where p.is_deleted = false 
                ${
                  key || cat
                    ? `and ${key ? `p.name like '${key}%'` : ""}
                ${cat ? ` ${key ? "and " : ""}p.cat_id = ${cat}` : ""}`
                    : ""
                }
                ${
                  sort ? `order by ${sort} ${asc ? "" : "desc"}` : ""
                } limit ?,?;`;

      const [[{ total }]] = await db.execute(countQuery);
      const [data] = await db.execute(query, [offset, limit]);

      res.status(200).send({ total, data });
    } catch (error) {
      res.status(500).send(error);
    }
  },

  add: async (req, res) => {
    try {
      const filename = req.file.originalname.split(".");
      const ext = filename[filename.length - 1];
      const img_name = "product-" + Date.now() + "." + ext;

      const storageRef = ref(storage, "products/" + img_name);
      await uploadBytes(storageRef, req.file.buffer, {
        contentType: "image/jpeg",
      });

      const img_url = await getDownloadURL(storageRef);

      const query = `insert into products (cat_id, name, price, img_name, img_url, description, stock, unit) 
                values (?, ?, ?, ?, ?, ?, ?, ?);`;

      const { cat_id, name, price, description, stock, unit } = req.body;

      await db.execute(query, [
        +cat_id,
        name,
        +price,
        img_name,
        img_url,
        description,
        +stock,
        unit,
      ]);

      res.status(200).send(true);
    } catch (error) {
      res.status(500).send(error);
    }
  },

  update: async (req, res) => {
    try {
      let val = "";
      if (req.file) {
        const filename = req.file.originalname.split(".");
        const ext = filename[filename.length - 1];
        const img_name = "product-" + Date.now() + "." + ext;

        const storageRef = ref(storage, "products/" + img_name);
        await uploadBytes(storageRef, req.file.buffer, {
          contentType: "image/jpeg",
        });

        const img_url = await getDownloadURL(storageRef);
        val += `img_name = '${img_name}', img_url = '${img_url}'`;

        const desertRef = ref(storage, "products/" + req.body.imgName);
        await deleteObject(desertRef);
      }

      if (Object.keys(req.body).length) {
        for (const key in req.body) {
          if (key !== ("id" && "imgName")) {
            const value = req.body[key];
            val += val ? ", " : "";
            val += `${key} = ${parseInt(value) ? value : `'${value}'`}`;
          }
        }
      }

      const query = `update products set ${val} where id = ?;`;

      await db.execute(query, [req.body.id]);

      res.status(200).send(true);
    } catch (error) {
      res.status(500).send(error);
    }
  },

  delete: async (req, res) => {
    try {
      const query = `update products set is_deleted = true where id = ?;`;

      await db.execute(query, [req.params.id]);

      res.status(200).send(true);
    } catch (error) {
      res.status(500).send(error);
    }
  },
};
