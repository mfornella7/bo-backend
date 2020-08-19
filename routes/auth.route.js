const express           = require('express');
const router            = express.Router();
const authControl       = require('../controllers/auth.controller');
const authMiddleware    = require('../utils/auth');

router.route('/login').post(authControl.logIn);
router.route('/signup').post(authControl.signUp);
router.route('/update').put(authMiddleware, authControl.update);

module.exports = router;