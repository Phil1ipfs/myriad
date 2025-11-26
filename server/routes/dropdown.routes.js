const express = require("express");
const router = express.Router();
const fieldController = require("../controllers/dropdown.controllers");

router.get("/fields", fieldController.getActiveFields);
router.get("/doctors", fieldController.getActiveDoctors);
router.post("/fields/seed", fieldController.seedSpecializations);

module.exports = router;
