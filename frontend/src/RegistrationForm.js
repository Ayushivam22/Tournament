import React, { useState } from 'react';
import Player from './Player';
import './RegistrationForm.css';

const RegistrationForm = () => {
    const [teamData, setTeamData] = useState({
        teamName: '',
        player1: { name: '', ig_name: '', ig_id: '' },
        player2: { name: '', ig_name: '', ig_id: '' },
        player3: { name: '', ig_name: '', ig_id: '' },
        player4: { name: '', ig_name: '', ig_id: '' },
        player5: { name: '', ig_name: '', ig_id: '' }
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setTeamData((prevTeamData) => ({
            ...prevTeamData,
            [name]: value
        }));
    };

    const handlePlayerChange = (playerKey, newFormData) => {
        setTeamData((prevTeamData) => ({
            ...prevTeamData,
            [playerKey]: newFormData
        }));
    };

    const submitHandler = async () => {
        try {
            // Collect player data into an array
            const players = Object.values(teamData).slice(1); // Skip teamName

            // Create the team with player data
            const teamDataToSend = {
                teamName: teamData.teamName,
                players: players
            };
            const response = await fetch('http://localhost:3000/api/v1/createteam', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(teamDataToSend)
            });

            const result = await response.json();

        } catch (error) {
            console.error('Error submitting team data:', error);
        }
    };

    return (
        <div className='RegForm'>
            <h2>Registration Form</h2>
            <div className='teamName'>
                <label>Team Name:</label>
                <input
                    type="text"
                    name="teamName"
                    placeholder='Team Name'
                    value={teamData.teamName}
                    onChange={handleInputChange}
                />
            </div>
            {Object.keys(teamData).slice(1).map((playerKey, index) => (
                <div key={playerKey}>
                    <span>Player {index + 1}:</span>
                    <Player
                        formData={teamData[playerKey]}
                        onFormDataChange={(newFormData) => handlePlayerChange(playerKey, newFormData)}
                    />
                </div>
            ))}
            <button type="submit" className='submit' name='submit' onClick={submitHandler}>Submit</button>
        </div>
    );
}

export default RegistrationForm;
