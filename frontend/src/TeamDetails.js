import React, { useEffect, useState } from 'react';
import './TeamDetails.css'
const TeamDetails = () => {
  const [teams, setTeams] = useState([]);

  useEffect(() => {
    const fetchTeams = async () => {
      try {
        const response = await fetch('http://localhost:4000/api/v1/getteams'); // Ensure this points to the correct backend port
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        // Extract teams array from the response object
        if (data.success) {
          setTeams(data.teams); // Set the teams array in the state
        } else {
          console.error('Failed to fetch teams:', data.message);
        }
      } catch (error) {
        console.error('Error fetching teams:', error);
      }
    };

    fetchTeams();
  }, []);

  return (
    <div className='team-container'>
      {teams.length > 0 ? (
        teams.map((team) => (
          <div key={team._id} className='singleTeam'>
            <h1 className='team-header'>Team: {team.teamName}</h1>
            <ul className='player-item'>
              {team.players.map((player) => (
                <li key={player._id}>
                  <h2>{player.name}</h2>
                  <p>In-game Name: {player.ig_name}</p>
                  <p>In-game ID: {player.ig_id}</p>
                </li>
              ))}
            </ul>
          </div>
        ))
      ) : (
        <p>No teams available.</p>
      )}
    </div>
  );
};

export default TeamDetails;
