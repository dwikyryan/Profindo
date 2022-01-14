const express = require("express");
const { adminController } = require("../controller");
const router = express.Router();

router.get("/get-admin", adminController.getAdmin);

module.exports = router;
