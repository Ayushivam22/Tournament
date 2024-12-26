import React from 'react';
import './Player.css'; // Import the CSS file

const Player = ({ formData, onFormDataChange }) => {
    const changeHandler = (event) => {
        const { name, value } = event.target;
        const newFormData = { ...formData, [name]: value };
        onFormDataChange(newFormData);
    };

    return (
        <div className="player">
            <form className='form'>
                <label className="input-label">
                    <input
                        type="text"
                        placeholder='Name'
                        name="name"
                        value={formData.name}
                        onChange={changeHandler}
                    />
                </label>
                <label className="input-label">
                    <input
                        type="text"
                        placeholder='In-Game Name'
                        name="ig-name"
                        value={formData['ig-name']}
                        onChange={changeHandler}
                    />
                </label>
                <label className="input-label">
                    <input
                        type="number"
                        placeholder='In-Game ID'
                        name="ig-id"
                        value={formData['ig-id']}
                        onChange={changeHandler}
                    />
                </label>
            </form>
        </div>
    );
}

export default Player;