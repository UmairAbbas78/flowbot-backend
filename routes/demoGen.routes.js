const express = require('express');
const router = express.Router();
const { triggerDemo, recordManualDemo } = require('../controllers/demoGen.controller');

router.post('/record', triggerDemo);
router.post('/record/manual', recordManualDemo);

module.exports = router;
