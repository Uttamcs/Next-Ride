const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const paymentController = require('../controllers/payment.controller');
const authMiddleware = require('../middleware/auth.middleware');

// Create a payment for a ride (for users)
router.post(
  '/create',
  authMiddleware.authUser,
  [
    body('rideId').notEmpty().withMessage('Ride ID is required'),
    body('method').optional().isIn(['cash', 'card', 'wallet']).withMessage('Payment method must be cash, card, or wallet')
  ],
  paymentController.createPayment
);

// Process a payment (for users)
router.post(
  '/process',
  authMiddleware.authUser,
  [
    body('paymentId').notEmpty().withMessage('Payment ID is required'),
    body('paymentDetails').optional().isObject().withMessage('Payment details must be an object')
  ],
  paymentController.processPayment
);

// Get payment details (for both users and captains)
router.get(
  '/:paymentId',
  (req, res, next) => {
    // Check if either user or captain is authenticated
    const token = req.cookies.token || req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    
    // Try to authenticate as user first, then as captain
    authMiddleware.authUser(req, res, (err) => {
      if (!err) {
        // User authentication successful
        return next();
      }
      
      // Try captain authentication
      authMiddleware.authCaptain(req, res, next);
    });
  },
  paymentController.getPaymentDetails
);

// Get payment by ride ID (for both users and captains)
router.get(
  '/ride/:rideId',
  (req, res, next) => {
    // Check if either user or captain is authenticated
    const token = req.cookies.token || req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    
    // Try to authenticate as user first, then as captain
    authMiddleware.authUser(req, res, (err) => {
      if (!err) {
        // User authentication successful
        return next();
      }
      
      // Try captain authentication
      authMiddleware.authCaptain(req, res, next);
    });
  },
  paymentController.getPaymentByRideId
);

module.exports = router;
