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
                        name="ig_name"
                        value={formData['ig_name']}
                        onChange={changeHandler}
                    />
                </label>
                <label className="input-label">
                    <input
                        type="number"
                        placeholder='In-Game ID'
                        name="ig_id"
                        value={formData['ig_id']}
                        onChange={changeHandler}
                    />
                </label>
            </form>
        </div>
    );
}

export default Player;