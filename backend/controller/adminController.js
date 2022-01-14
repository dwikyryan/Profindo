const { db } = require("../database");

module.exports = {
  getAdmin: (req, res) => {
    let scriptQuery = `Select * from apoteker where kodeApoteker = ${db.escape(
      req.query.id
    )} and password = ${db.escape(req.query.password)};`;
    console.log(scriptQuery);

    db.query(scriptQuery, (err, results) => {
      if (err) return res.status(500).send(err);
      return res.status(200).send(results);
    });
    console.log(scriptQuery);
  },
};
