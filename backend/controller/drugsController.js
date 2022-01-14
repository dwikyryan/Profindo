const { db } = require("../database");

module.exports = {
  getDrugs: (req, res) => {
    let scriptQuery = `Select * from obat;`;
    if (req.query.page) {
      scriptQuery = `Select * from obat limit ${req.query.page}, ${req.query.item};`;
      console.log(scriptQuery);
    }
    db.query(scriptQuery, (err, results) => {
      if (err) return res.status(500).send(err);
      return res.status(200).send(results);
    });
    console.log(scriptQuery);
  },
  getNewDrugs: (req, res) => {
    let scriptQuery = `Select * from obat ORDER BY kodeObat DESC;`;
    if (req.query.page) {
      scriptQuery = `Select * from obat ORDER BY kodeObat DESC limit ${req.query.page}, ${req.query.item};`;
      console.log(scriptQuery);
    }
    db.query(scriptQuery, (err, results) => {
      if (err) return res.status(500).send(err);
      return res.status(200).send(results);
    });
    console.log(scriptQuery);
  },

  addDrugs: (req, res) => {
    console.log(req.body);
    let { kodeObat, namaObat, hargaObat, sisaObat, tanggalKadaluarsa } =
      req.body;
    let insertQuery = `Insert into obat (kodeObat, namaObat, hargaObat, sisaObat, tanggalKadaluarsa) values (${db.escape(
      kodeObat
    )}, ${db.escape(namaObat)}, ${db.escape(hargaObat)}, ${db.escape(
      sisaObat
    )}, ${db.escape(tanggalKadaluarsa)});`;
    console.log(insertQuery);
    db.query(insertQuery, (err, results) => {
      if (err) return res.status(500).send(err);
      db.query(
        `Select * from obat where namaObat = ${db.escape(namaObat)};`,
        (err2, results2) => {
          if (err2) return res.status(500).send(err2);
          return res
            .status(200)
            .send({ message: "Penambahan data obat berhasil", data: results2 });
        }
      );
    });
  },

  editDrugs: (req, res) => {
    let dataUpdate = [];
    for (let prop in req.body) {
      dataUpdate.push(`${prop} = ${db.escape(req.body[prop])}`);
    }
    let updateQuery = `Update obat set ${dataUpdate} where kodeObat = ${db.escape(
      req.params.id
    )};`;
    console.log(updateQuery);
    db.query(updateQuery, (err, results) => {
      if (err) return res.status(500).send(err);
      return res.status(200).send(results);
    });
  },
  deleteDrugs: (req, res) => {
    let deleteQuery = `delete from obat where kodeObat = ${db.escape(
      req.params.id
    )};`;
    db.query(deleteQuery, (err, results) => {
      if (err) return res.status(500).send(err);
      return res.status(200).send(results);
    });
  },
};
