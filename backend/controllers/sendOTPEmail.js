const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'aks42423@gmail.com',
    pass:'whqy jpzy efkc pfrk',
  },
});

const sendOTPEmail = async (email, otp) => {
  const mailOptions = {
    from:'aks42423@gmail.com',
    to: email,
    subject: 'Your OTP Code',
    text: `Your OTP code is ${otp}`,
  };

  try {
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error('Error sending OTP email:', error);
  }
};
module.exports = sendOTPEmail;
