const express = require('express');
const router = express.Router();

const { addToken, fetchAccountDetails } = require('../controllers/token');

router.post('/add', addToken);
router.post('/account-details', fetchAccountDetails)
// router.post('/signup', signUP);

module.exports = router;
