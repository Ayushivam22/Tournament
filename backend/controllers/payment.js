const Razorpay = require('razorpay');
const crypto = require('crypto');
const {Team} = require('../models/team'); // Adjust the path as necessary
const sendWelcomeEmail = require('../controllers/sendWelcomeMail');

const initiatePayment = async (req, res) => {
  try {
    const { amount, currency, receipt } = req.body;

    const instance = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });

    const options = {
      amount: amount * 100, // amount in the smallest currency unit
      currency,
      receipt,
    };

    const order = await instance.orders.create(options);

    res.status(201).json({
      success: true,
      order,
      message: "Payment initiated successfully",
    });
  } catch (error) {
    console.error('Error initiating payment:', error);
    res.status(500).json({
      success: false,
      message: "Error initiating payment",
      error: error.message,
    });
  }
};

const validatePayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, contactEmail, name } = req.body;  // Destructure all necessary fields here

    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest('hex');

    const isAuthentic = expectedSignature === razorpay_signature;

    if (isAuthentic) {
      // Update payment status in the database
      await Team.findOneAndUpdate(
        { contactEmail: contactEmail },
        { paymentDone: true }
      );

      // Send confirmation email
      sendWelcomeEmail(contactEmail, name);

      res.status(200).json({
        success: true,
        message: "Payment validated successfully",
      });
    } else {
      res.status(400).json({
        success: false,
        message: "Invalid payment signature",
      });
    }
  } catch (error) {
    console.error('Error validating payment:', error);
    res.status(500).json({
      success: false,
      message: "Error validating payment",
      error: error.message,
    });
  }
};

module.exports = { initiatePayment, validatePayment };
