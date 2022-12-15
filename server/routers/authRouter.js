const express = require('express');
const router = express.Router();

const { signUP, login } = require('../controllers/auth');

router.post('/login', login)
router.post('/signup', signUP);

module.exports = router;
