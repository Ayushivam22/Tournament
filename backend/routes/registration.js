const express = require('express');
const {getTeams,createTeam} = require('../controllers/registration');

const router = express.Router();

// router.post('/createplayer', createPlayer);
router.post('/createteam', createTeam);
router.get('/getteams', getTeams);


module.exports = router;