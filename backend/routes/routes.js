const express = require('express');
const { initiatePayment, validatePayment } = require('../controllers/payment');

const router = express.Router();

router.post('/initiatepayment', initiatePayment);
router.post('/validatepayment', validatePayment);

const {getTeams,createTeam} = require('../controllers/registration');

// router.post('/createplayer', createPlayer);
router.post('/createteam', createTeam);
router.get('/getteams', getTeams);


module.exports = router;