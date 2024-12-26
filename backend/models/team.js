const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const playerSchema = new Schema({
  name: { type: String},
  ig_name: { type: String},
  ig_id: { type: String }
});

const teamSchema = new Schema({
  teamName: { type: String, required: true },
  players: [playerSchema]
});

const Team = mongoose.model('Team', teamSchema);

module.exports = Team;
