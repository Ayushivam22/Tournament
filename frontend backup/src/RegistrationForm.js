import React, { useState } from 'react';
import Player from './Player';
import './RegistrationForm.css';

const RegistrationForm = () => {
    const [teamData, setTeamData] = useState({
        player1: { name: '', 'ig-name': '', 'ig-id': '' },
        player2: { name: '', 'ig-name': '', 'ig-id': '' },
        player3: { name: '', 'ig-name': '', 'ig-id': '' },
        player4: { name: '', 'ig-name': '', 'ig-id': '' },
        player5: { name: '', 'ig-name': '', 'ig-id': '' }
    });

    const handlePlayerChange = (playerKey, newFormData) => {
        setTeamData((prevTeamData) => ({
            ...prevTeamData,
            [playerKey]: newFormData
        }));
    };

    const submitHandler = () => {
        console.log(teamData);
    };

    return (
        <div className='RegForm'>
            <h2>RegistrationForm</h2>
            {Object.keys(teamData).map((playerKey, index) => (
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