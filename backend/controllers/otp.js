const { OTP,Team } = require("../models/team"); // Adjust the path as necessary
const sendOTPEmail = require("./sendOTPEmail"); // You'll need a function to send OTP via email
exports.sendOTP = async (req, res) => {
  const { contactEmail } = req.body;
  console.log("Received contactEmail in backend:", contactEmail);

  if (!contactEmail) {
    return res.status(400).json({ message: "contactEmail is required" });
  }
  const user = Team.findOne(contactEmail);
  if(user)
  {
    return res.status(400).json({ success:false,message: "User already exists with this email" });
  }
  // Generate a random OTP
  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  try {
    // Delete existing record if any
    await OTP.deleteOne({ contactEmail });

    // Save OTP in the database
    const otpRecord = new OTP({ otp, contactEmail });
    await otpRecord.save();

    // Send OTP via email
    await sendOTPEmail(contactEmail, otp);

    res.status(200).json({ success: true, message: "OTP sent successfully" });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ success: false, message: "Error sending OTP", error });
  }
};

exports.verifyOTP = async (req, res) => {
  const { contactEmail, otp } = req.body;

  try {
    // Find the OTP record
    const otpRecord = await OTP.findOne({ contactEmail, otp });

    if (!otpRecord) {
      return res.status(400).json({ success: false, message: "Invalid OTP" });
    }

    // If OTP is found and valid, delete it from the database
    await OTP.deleteOne({ contactEmail, otp });

    res
      .status(200)
      .json({ success: true, message: "OTP verified successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Error verifying OTP", error });
  }
};
