const express = require("express");
const { transactionController } = require("../controller");
const router = express.Router();

router.get("/get-transaksi", transactionController.getTransaction);
router.post("/add-transaksi", transactionController.addTransaction);

module.exports = router;
