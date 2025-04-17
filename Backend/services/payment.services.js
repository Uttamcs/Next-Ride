const paymentModel = require('../models/payment.model');
const rideModel = require('../models/ride.model');

// Create a new payment
const createPayment = async (paymentData) => {
  try {
    const payment = await paymentModel.create(paymentData);
    return payment;
  } catch (error) {
    throw new Error(`Error creating payment: ${error.message}`);
  }
};

// Update payment status
const updatePaymentStatus = async (paymentId, status, transactionData = {}) => {
  try {
    const payment = await paymentModel.findByIdAndUpdate(
      paymentId,
      {
        status,
        ...transactionData,
        updatedAt: new Date()
      },
      { new: true }
    );
    
    // Also update the payment status in the ride
    if (payment) {
      await rideModel.findByIdAndUpdate(
        payment.ride,
        { paymentStatus: status }
      );
    }
    
    return payment;
  } catch (error) {
    throw new Error(`Error updating payment status: ${error.message}`);
  }
};

// Get payment details
const getPaymentDetails = async (paymentId) => {
  try {
    const payment = await paymentModel.findById(paymentId)
      .populate('ride')
      .populate('user', 'fullname email')
      .populate('captain', 'fullname email');
    
    if (!payment) {
      throw new Error('Payment not found');
    }
    
    return payment;
  } catch (error) {
    throw new Error(`Error getting payment details: ${error.message}`);
  }
};

// Get payment by ride ID
const getPaymentByRideId = async (rideId) => {
  try {
    const payment = await paymentModel.findOne({ ride: rideId })
      .populate('user', 'fullname email')
      .populate('captain', 'fullname email');
    
    return payment;
  } catch (error) {
    throw new Error(`Error getting payment by ride ID: ${error.message}`);
  }
};

// Process payment (mock implementation - in a real app, this would integrate with a payment gateway)
const processPayment = async (paymentId, paymentMethod, paymentDetails) => {
  try {
    // In a real implementation, this would call a payment gateway API
    // For now, we'll simulate a successful payment
    
    // Generate a mock transaction ID
    const transactionId = 'TXN' + Date.now() + Math.floor(Math.random() * 1000);
    
    // Update payment with transaction details
    const payment = await updatePaymentStatus(
      paymentId,
      'completed',
      {
        transactionId,
        paymentGatewayResponse: {
          success: true,
          message: 'Payment processed successfully',
          timestamp: new Date(),
          ...paymentDetails
        }
      }
    );
    
    return payment;
  } catch (error) {
    // If payment processing fails, update the payment status to failed
    await updatePaymentStatus(
      paymentId,
      'failed',
      {
        paymentGatewayResponse: {
          success: false,
          message: error.message,
          timestamp: new Date()
        }
      }
    );
    
    throw new Error(`Error processing payment: ${error.message}`);
  }
};

module.exports = {
  createPayment,
  updatePaymentStatus,
  getPaymentDetails,
  getPaymentByRideId,
  processPayment
};
