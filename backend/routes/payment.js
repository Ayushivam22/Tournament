const express = require('express');
const { initiatePayment, validatePayment } = require('../controllers/payment');

const router = express.Router();

router.post('/initiatepayment', initiatePayment);
router.post('/validatepayment', validatePayment);

module.exports = router;