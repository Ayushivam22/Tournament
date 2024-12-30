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
        player5: { name: '', ig_name: '', ig_id: '' },
        email: '',
        phone: ''
    });

    const [errors, setErrors] = useState({});

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

    const validateEmail = (email) => {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(String(email).toLowerCase());
    };

    const validatePhone = (phone) => {
        const re = /^[0-9]{10}$/;
        return re.test(String(phone));
    };

    const validateForm = () => {
        const newErrors = {};
        if (!teamData.teamName) newErrors.teamName = 'Team name is required';
        if (!teamData.email) {
            newErrors.email = 'Email is required';
        } else if (!validateEmail(teamData.email)) {
            newErrors.email = 'Invalid email format';
        }
        if (!teamData.phone) {
            newErrors.phone = 'Phone number is required';
        } else if (!validatePhone(teamData.phone)) {
            newErrors.phone = 'Invalid phone number format';
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const submitHandler = async () => {
        if (!validateForm()) {
            return; // Stop submission if there are validation errors
        }

        try {
            // Collect player data into an array
            const players = Object.values(teamData).slice(1, 6); // Skip teamName, email, and phone

            // Create the team with player data
            const teamDataToSend = {
                teamName: teamData.teamName,
                players: players,
                email: teamData.email,
                phone: teamData.phone
            };
            const response = await fetch('http://localhost:3000/api/v1/createteam', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(teamDataToSend)
            });

            const result = await response.json();
            console.log('Team data submitted:', result);
        } catch (error) {
            console.error('Error submitting team data:', error);
        }
    };

    const paymentHandler = async () => {
        if (!validateForm()) {
            return; // Stop payment initiation if there are validation errors
        }

        console.log('Payment button clicked'); // Debugging log
        try {
            const response = await fetch('http://localhost:3000/api/v1/initiatepayment', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    amount: 1, // Amount in smallest currency unit (1 rupee)
                    currency: 'INR',
                    receipt: `receipt_${Date.now()}`
                })
            });
    
            const result = await response.json();
            console.log(result);
    
            if (result.success) {
                const options = {
                    key: process.env.REACT_APP_RAZORPAY_KEY_ID, // Enter the Key ID generated from the Dashboard
                    amount: result.order.amount,
                    currency: result.order.currency,
                    name: "Tournament Registration",
                    description: "Test Transaction",
                    order_id: result.order.id,
                    handler: async function(response) {
                        const validateResponse = await fetch("http://localhost:3000/api/v1/validatepayment", {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json"
                            },
                            body: JSON.stringify(response)
                        });
                        const validateResult = await validateResponse.json();
                        console.log('validateResult', validateResult);
                    },
                    prefill: {
                        name: "Your Name",
                        email: "your.email@example.com",
                        contact: "9999999999"
                    },
                    notes: {
                        address: "Razorpay Corporate Office"
                    },
                    theme: {
                        color: "#3399cc"
                    }
                };
                const rzp1 = new window.Razorpay(options);
                rzp1.open();
            } else {
                console.error('Error initiating payment:', result.message);
            }
        } catch (error) {
            console.error('Error submitting payment:', error);
        }
    };

    return (
        <div className='RegForm'>
            <h2>Registration Form</h2>
            <div className='teamName'>
                <label>Team Name:</label>
                <br />
                <input
                    type="text"
                    name="teamName"
                    placeholder='Team Name'
                    value={teamData.teamName}
                    onChange={handleInputChange}
                />
                {errors.teamName && <p className="error">{errors.teamName}</p>}
            </div>
            {Object.keys(teamData).slice(1, 6).map((playerKey, index) => (
                <div key={playerKey}>
                    <span>Player {index + 1}:</span>
                    <Player
                        formData={teamData[playerKey]}
                        onFormDataChange={(newFormData) => handlePlayerChange(playerKey, newFormData)}
                    />
                </div>
            ))}
            <div className='contactInfo'>
                <label>Email:</label>
                <br />
                <input
                    type="email"
                    name="email"
                    placeholder='Email'
                    value={teamData.email}
                    onChange={handleInputChange}
                />
                {errors.email && <p className="error">{errors.email}</p>}
                <label>Phone:</label>
                <input
                    type="number"
                    name="phone"
                    placeholder='Phone'
                    value={teamData.phone}
                    onChange={handleInputChange}
                />
                {errors.phone && <p className="error">{errors.phone}</p>}
            </div>
            <button type="submit" className='submit' name='submit' onClick={submitHandler}>Submit</button>
            <button type='button' className='submit' name='payment' onClick={paymentHandler}>Pay</button>
        </div>
    );
}

export default RegistrationForm;
