const Team = require("../models/team");

const createTeam = async (req, res) => {
  try {
    const { teamName, players } = req.body;

    // Create the team with embedded player details
    const team = new Team({ teamName, players });
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

const getTeams = async (req, res) => {
  try {
    const teams = await Team.find();
    res.status(200).json(teams);
  } catch (error) {
    res.status(500).json({
      message: "Error fetching teams",
      error,
    });
  }
};

module.exports = {
  createTeam,
  getTeams,
};
