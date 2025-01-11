const express = require('express');
const router = express.Router();
const {
  addAdmin,
  removeAdmin
} = require('../controllers/Admin.controller');
const {authMiddleware} = require("../middleware/authmiddleware");
const {isAdminMiddleware} = require("../middleware/adminmiddleware")

router.post('/add',authMiddleware,isAdminMiddleware, addAdmin);
router.post('/remove',authMiddleware,isAdminMiddleware, removeAdmin);


module.exports = router;
