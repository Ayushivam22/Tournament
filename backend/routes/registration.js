const express = require('express');
const {createTeam} = require('../controllers/registration');

const router = express.Router();

// router.post('/createplayer', createPlayer);
router.post('/createteam', createTeam);


module.exports = router;