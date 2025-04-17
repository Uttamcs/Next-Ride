const paymentService = require('../services/payment.services');
const rideService = require('../services/ride.services');
const { validationResult } = require('express-validator');

// Create a payment for a ride
module.exports.createPayment = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { rideId, method } = req.body;
    
    // Get ride details
    const ride = await rideService.getRideDetails(rideId);
    
    // Check if ride exists and is completed
    if (!ride) {
      return res.status(404).json({ message: 'Ride not found' });
    }
    
    if (ride.status !== 'completed') {
      return res.status(400).json({ message: 'Payment can only be created for completed rides' });
    }
    
    // Check if payment already exists for this ride
    const existingPayment = await paymentService.getPaymentByRideId(rideId);
    if (existingPayment) {
      return res.status(400).json({ message: 'Payment already exists for this ride' });
    }
    
    // Create payment
    const paymentData = {
      ride: rideId,
      user: ride.user._id,
      captain: ride.captain._id,
      amount: ride.fare,
      method: method || ride.paymentMethod
    };
    
    const payment = await paymentService.createPayment(paymentData);
    
    res.status(201).json({
      message: 'Payment created successfully',
      payment
    });
  } catch (error) {
    console.error('Error creating payment:', error);
    res.status(500).json({ message: 'Error creating payment', error: error.message });
  }
};

// Process a payment
module.exports.processPayment = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { paymentId, paymentDetails } = req.body;
    
    // Get payment
    const payment = await paymentService.getPaymentDetails(paymentId);
    
    if (!payment) {
      return res.status(404).json({ message: 'Payment not found' });
    }
    
    if (payment.status === 'completed') {
      return res.status(400).json({ message: 'Payment already completed' });
    }
    
    // Process payment
    const processedPayment = await paymentService.processPayment(
      paymentId,
      payment.method,
      paymentDetails
    );
    
    res.status(200).json({
      message: 'Payment processed successfully',
      payment: processedPayment
    });
  } catch (error) {
    console.error('Error processing payment:', error);
    res.status(500).json({ message: 'Error processing payment', error: error.message });
  }
};

// Get payment details
module.exports.getPaymentDetails = async (req, res) => {
  try {
    const { paymentId } = req.params;
    
    const payment = await paymentService.getPaymentDetails(paymentId);
    
    if (!payment) {
      return res.status(404).json({ message: 'Payment not found' });
    }
    
    res.status(200).json({
      payment
    });
  } catch (error) {
    console.error('Error getting payment details:', error);
    res.status(500).json({ message: 'Error getting payment details', error: error.message });
  }
};

// Get payment by ride ID
module.exports.getPaymentByRideId = async (req, res) => {
  try {
    const { rideId } = req.params;
    
    const payment = await paymentService.getPaymentByRideId(rideId);
    
    if (!payment) {
      return res.status(404).json({ message: 'Payment not found for this ride' });
    }
    
    res.status(200).json({
      payment
    });
  } catch (error) {
    console.error('Error getting payment by ride ID:', error);
    res.status(500).json({ message: 'Error getting payment by ride ID', error: error.message });
  }
};
