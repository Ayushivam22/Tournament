const Team = require("../models/team");

// Function to create a team
const createTeam = async (req, res) => {
  try {
    const { teamName, players, contactEmail, contactPhone, isVerified } = req.body;

    // Create the team with the provided details
    const team = new Team({ teamName, players, contactEmail, contactPhone, isVerified });
    await team.save();

    res.status(201).json({
      success: true,
      team,
      message: "Team created successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error creating team",
      error,
    });
  }
};

// Function to get all teams
const getTeams = async (req, res) => {
  try {
    const teams = await Team.find();
    res.status(200).json({
      success: true,
      teams,
      message: "Teams fetched successfully",
    });
    console.log('Teams fetched successfully');
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching teams",
      error,
    });
  }
};

module.exports = {
  createTeam,
  getTeams,
};
