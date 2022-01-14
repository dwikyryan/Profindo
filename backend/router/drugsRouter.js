const express = require("express");
const { drugsController } = require("../controller");
const router = express.Router();

router.get("/get-obat", drugsController.getDrugs);
router.get("/get-new-obat", drugsController.getNewDrugs);
router.post("/add-obat", drugsController.addDrugs);
router.patch("/edit-obat/:id", drugsController.editDrugs);
router.delete("/delete-obat/:id", drugsController.deleteDrugs);

module.exports = router;
