const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const ratingController = require('../controllers/rating.controller');
const authMiddleware = require('../middleware/auth.middleware');

// Create a rating (for both users and captains)
router.post(
  '/create',
  [
    body('rideId').notEmpty().withMessage('Ride ID is required'),
    body('rating').isInt({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5'),
    body('review').optional().isString().withMessage('Review must be a string')
  ],
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
  ratingController.createRating
);

// Get user ratings (for users)
router.get(
  '/user/:userId?',
  authMiddleware.authUser,
  ratingController.getUserRatings
);

// Get captain ratings (for captains and users)
router.get(
  '/captain/:captainId?',
  (req, res, next) => {
    // If captainId is provided, allow public access
    if (req.params.captainId) {
      return next();
    }
    
    // Otherwise, require captain authentication
    authMiddleware.authCaptain(req, res, next);
  },
  ratingController.getCaptainRatings
);

module.exports = router;
