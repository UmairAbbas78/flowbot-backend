const express = require("express");
const router = express.Router();
const {
  triggerDemo,
  recordManualDemo,
  getAllDemos,
  getDemoById,
} = require("../controllers/demoGen.controller");

router.post("/record", triggerDemo);
router.post("/record/manual", recordManualDemo);
router.get("/", getAllDemos);
router.get("/:id", getDemoById);

module.exports = router;
