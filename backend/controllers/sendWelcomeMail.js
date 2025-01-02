const fs = require('fs');
const path = require('path');
const nodemailer = require('nodemailer');
const { Welcome_Email_Template } = require('../models/EmailTemplates');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'aks42423@gmail.com',
    pass:'whqy jpzy efkc pfrk',
  },
});

const sendWelcomeEmail = async (email, name) => {
  const htmlContent = Welcome_Email_Template.replace('{name}', name);

  const mailOptions = {
    from:'aks42423@gmail.com',
    to: email,
    subject: 'Congratulations ! You have successfully registered.',
    html: htmlContent,  
  };

  try {
    await transporter.sendMail(mailOptions);
    // console.log('OTP email sent successfully');
  } catch (error) {
    console.error('Error sending OTP email:', error);
  }
};

module.exports = sendWelcomeEmail;
