const express = require('express');
const { initiatePayment, validatePayment } = require('../controllers/payment');
const { sendOTP, verifyOTP } = require('../controllers/otp'); // Adjust the path as necessary
const {  createTeam } = require('../controllers/registration');

const router = express.Router();

// PAYMENT ROUTES
router.post('/initiatepayment', initiatePayment);
router.post('/validatepayment', validatePayment);

// Registration routes
router.post('/createteam', createTeam);
// router.get('/getteams', getTeams);

// OTP routes
router.post('/sendotp', sendOTP);
router.post('/verifyotp', verifyOTP);

module.exports = router;
