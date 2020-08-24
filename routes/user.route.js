const express = require('express');

const router = express.Router();
const userControl = require('../controllers/user.controller');

router.route('/bet/:id')
  .put(userControl.placeBet)

router.route('/deposit/:id')
  .put(userControl.depositToBalance)
  
router.param('id', userControl.getUserById);

module.exports = router;

