const { db } = require("../database");

module.exports = {
  getTransaction: (req, res) => {
    let scriptQuery = `select transaksi.idTransaksi, obat.namaObat, transaksi.jumlahJual, obat.hargaObat, transaksi.tanggalBeli, apoteker.namaApoteker from transaksi
        left join obat on obat.kodeObat = transaksi.kodeObat
        left join apoteker on apoteker.kodeApoteker = transaksi.kodeApoteker
        order by transaksi.tanggalBeli desc;`;
    if (req.query.page) {
      scriptQuery = `select transaksi.idTransaksi, obat.namaObat, transaksi.jumlahJual, obat.hargaObat, transaksi.tanggalBeli, apoteker.namaApoteker from transaksi
          left join obat on obat.kodeObat = transaksi.kodeObat
          left join apoteker on apoteker.kodeApoteker = transaksi.kodeApoteker
          order by transaksi.tanggalBeli desc limit ${req.query.page}, ${req.query.item};`;
      console.log(scriptQuery);
    }
    db.query(scriptQuery, (err, results) => {
      if (err) return res.status(500).send(err);
      return res.status(200).send(results);
    });
    console.log(scriptQuery);
  },
  addTransaction: (req, res) => {
    console.log(req.body);
    let { idTransaksi, kodeObat, jumlahJual, kodeApoteker, tanggalBeli } =
      req.body;
    let insertQuery = `Insert into transaksi (idTransaksi, kodeObat, jumlahJual, kodeApoteker, tanggalBeli) values (${db.escape(
      idTransaksi
    )}, ${db.escape(kodeObat)}, ${db.escape(jumlahJual)}, ${db.escape(
      kodeApoteker
    )}, ${db.escape(tanggalBeli)});`;
    console.log(insertQuery);
    db.query(insertQuery, (err, results) => {
      if (err) return res.status(500).send(err);
      db.query(
        `Select * from transaksi where idTransaksi = ${db.escape(
          idTransaksi
        )};`,
        (err2, results2) => {
          if (err2) return res.status(500).send(err2);
          return res.status(200).send({
            message: "Penambahan data transaksi berhasil",
            data: results2,
          });
        }
      );
    });
  },
};
