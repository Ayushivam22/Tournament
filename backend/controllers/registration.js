const {Team} = require("../models/team");

const createTeam = async (req, res) => {
  try {
    console.log('Request body:', req.body);
    const { teamName, players, contactEmail, contactPhone } = req.body;

    // Manually validate required fields
    if (!teamName || !players || !contactEmail || !contactPhone) {
      console.error('Validation error:', {
        teamName,
        players,
        contactEmail,
        contactPhone,
      });
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    // Log before creating the team object
    console.log('Creating team object with:', {
      teamName,
      players,
      contactEmail,
      contactPhone,
    });

    // Create the team with the provided details
    const team = new Team({ teamName, players, contactEmail, contactPhone });

    // Log after team object is created but before saving
    console.log('Team created:', team);

    await team.save();

    res.status(201).json({
      success: true,
      team,
      message: "Team created successfully",
    });
  } catch (error) {
    console.error('Error creating team:', error); // Log the error details
    res.status(500).json({
      success: false,
      message: "Error creating team",
      error: error.message, // Provide error message for clarity
    });
  }
};

module.exports = {
  createTeam,
};
