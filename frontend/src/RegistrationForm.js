import React, { useState } from "react";
import Player from "./Player";
import "./RegistrationForm.css";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const RegistrationForm = () => {
  const [teamData, setTeamData] = useState({
    teamName: "",
    player1: { name: "", ig_name: "", ig_id: "" },
    player2: { name: "", ig_name: "", ig_id: "" },
    player3: { name: "", ig_name: "", ig_id: "" },
    player4: { name: "", ig_name: "", ig_id: "" },
    player5: { name: "", ig_name: "", ig_id: "" },
    contactEmail: "",
    contactPhone: "",
  });

  const [errors, setErrors] = useState({});
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false); // New state
  const [otp, setOtp] = useState("");

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    console.log(`Updating ${name} with value: ${value}`); // Log for debugging
    setTeamData((prevTeamData) => ({
      ...prevTeamData,
      [name]: value,
    }));
  };

  const handlePlayerChange = (playerKey, newFormData) => {
    setTeamData((prevTeamData) => ({
      ...prevTeamData,
      [playerKey]: newFormData,
    }));
  };

  const handleOtpChange = (e) => {
    setOtp(e.target.value);
  };

  const sendOtpHandler = async () => {
    console.log('insider sendOtpHandler')
    if (!validateForm()) {
      console.log('email validation failed');
      return; // Stop submission if there are validation errors
    }
    try {
      console.log('teamData::::',teamData)
      const response = await fetch("http://localhost:3000/api/v1/sendotp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ contactEmail: teamData.contactEmail }),
      });

      const result = await response.json();

      if (result.success) {
        setOtpSent(true); // OTP sent
        console.log("OTP sent successfully:", result);
        toast.success(result.message);
      } else {
        console.error("Error sending OTP:", result.message);
        toast.error(result.message);
      }
    } catch (error) {
      console.error("Error sending OTP:", error);
      toast.error("Error sending OTP");
    }
  };

  const verifyOtpHandler = async () => {
    try {
      const response = await fetch("http://localhost:3000/api/v1/verifyotp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ contactEmail: teamData.contactEmail, otp }),
      });

      const result = await response.json();
      if (result.success) {
        console.log("OTP verified successfully:", result);
        toast.success(result.message);
        setOtpVerified(true); // OTP verified
        await submitTeamData(); // Auto-submit the form data to the database
      } else {
        console.error("Error verifying OTP:", result.message);
        toast.error(result.message);
      }
    } catch (error) {
      console.error("Error verifying OTP:", error);
      toast.error("Error verifying OTP");
    }
  };

  const submitTeamData = async () => {
    try {
      const players = [
        teamData.player1,
        teamData.player2,
        teamData.player3,
        teamData.player4,
        teamData.player5,
      ];

      const teamDataToSend = {
        teamName: teamData.teamName,
        players: players,
        contactEmail: teamData.contactEmail,
        contactPhone: teamData.contactPhone,
      };
      console.log('request sent',teamDataToSend);
      const response = await fetch("http://localhost:3000/api/v1/createteam", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        
        body: JSON.stringify(teamDataToSend),
      });

      const result = await response.json();
      if(result.success) {
        console.log("Team data submitted:", result);
        toast.success("Team data submitted successfully");
      }
    } catch (error) {
      console.error("Error submitting team data:", error);
      toast.error("Error submitting team data");
    }
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
    if (!teamData.teamName) newErrors.teamName = "Team name is required";
    if (!teamData.contactEmail) {
      newErrors.contactEmail = "Email is required";
    } else if (!validateEmail(teamData.contactEmail)) {
      newErrors.contactEmail = "Invalid email format";
    }
    if (!teamData.contactPhone) {
      newErrors.contactPhone = "Phone number is required";
    } else if (!validatePhone(teamData.contactPhone)) {
      newErrors.contactPhone = "Invalid phone number format";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const paymentHandler = async () => {
    if (!otpVerified) {
      toast.error("Email verification pending");
      return;
    } // Stop the function from proceeding
  
    console.log("Payment button clicked"); // Debugging log
    try {
      const response = await fetch(
        "http://localhost:3000/api/v1/initiatepayment",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            amount: 1, // Amount in smallest currency unit (1 rupee)
            currency: "INR",
            receipt: `receipt_${Date.now()}`,
            contactEmail: teamData.contactEmail, // Include contactEmail
            name: teamData.teamName
          }),
        }
      );
  
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
          handler: async function (response) {
            const validateResponse = await fetch(
              "http://localhost:3000/api/v1/validatepayment",
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  ...response,
                  contactEmail: teamData.contactEmail, // Include contactEmail
                  name:teamData.teamName
                }),
              }
            );
            const validateResult = await validateResponse.json();
            console.log("validateResult", validateResult);
            if (validateResult.success) {
              toast.success("Congratulations Your registration is successfully.");
            } else {
              toast.error("Payment validation failed");
            }
          },
          prefill: {
            name: teamData.teamName,
            email: teamData.contactEmail,
            contact: teamData.contactPhone,
          },
          notes: {
            address: "Razorpay Corporate Office",
          },
          theme: {
            color: "#3399cc",
          },
        };
        const rzp1 = new window.Razorpay(options);
        rzp1.open();
      } else {
        console.error("Error initiating payment:", result.message);
        toast.error(result.message);
      }
    } catch (error) {
      console.error("Error submitting payment:", error);
      toast.error("Error submitting payment");
    }
  };
 
  return (
    <div className="RegForm">
    <ToastContainer />
      <h2>Registration Form</h2>
      <div className="playerInfo">
      <div className="teamName">
        <label>Team Name:</label>
        <br />
        <input
          type="text"
          name="teamName"
          placeholder="Team Name"
          value={teamData.teamName}
          onChange={handleInputChange}
        />
        {errors.teamName && <p className="error">{errors.teamName}</p>}
      </div>
      {Object.keys(teamData)
        .slice(1, 6)
        .map((playerKey, index) => (
          <div key={playerKey}>
            <span>Player {index + 1}:</span>
            <Player
              formData={teamData[playerKey]}
              onFormDataChange={(newFormData) =>
                handlePlayerChange(playerKey, newFormData)
              }
            />
          </div>
        ))}
        </div>
      <div className="contactInfo">
        <label>Email:</label>
        <input
          type="email"
          name="contactEmail" // Corrected name attribute
          placeholder="Email"
          value={teamData.contactEmail} // Corrected value
          onChange={handleInputChange}
        />
        <button type="button" onClick={sendOtpHandler}>
          Send OTP
        </button>
        {/* set otpSent to true just for Debugging purpose */}
        {otpSent && (
          <div className="otpInput">
            <input
              type="text"
              placeholder="Enter OTP"
              value={otp}
              onChange={handleOtpChange}
            />
            <button type="button" onClick={verifyOtpHandler}>
              Verify
            </button>
          </div>
        )}
        {errors.contactEmail && <p className="error">{errors.contactEmail}</p>}{" "}
        {/* Corrected error key */}
        <label>Phone:</label>
        <input
          type="number"
          name="contactPhone" // Corrected name attribute
          placeholder="Phone"
          value={teamData.contactPhone} // Corrected value
          onChange={handleInputChange}
        />
        {errors.contactPhone && <p className="error">{errors.contactPhone}</p>}{" "}
        {/* Corrected error key */}
      </div>
      <button
        type="button"
        className="submit"
        name="payment"
        onClick={paymentHandler}
      >
        Register & Pay
      </button>
    </div>
  );
};

export default RegistrationForm;
