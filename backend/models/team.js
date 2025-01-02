const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const playerSchema = new Schema({
  name: { type: String },
  ig_name: { type: String },
  ig_id: { type: String },
});

const teamSchema = new Schema({
  teamName: { type: String, required: true },
  players: [playerSchema],
  contactEmail: { type: String, required: true, unique: true },
  contactPhone: { type: Number, required: true },
  paymentDone: { type: Boolean, default: false },
});

const otpSchema = new Schema({
  otp: { type: String, required: true },
  contactEmail: { type: String, required: true, unique: true },
  createdAt: { type: Date, default: Date.now, expires: "5m" }, // This makes the OTP expire after 5 minutes
});

const OTP = mongoose.model("OTP", otpSchema);
const Team = mongoose.model("Team", teamSchema);

module.exports = {
  Team,
  OTP
};
