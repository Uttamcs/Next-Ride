const ratingService = require('../services/rating.services');
const rideService = require('../services/ride.services');
const { validationResult } = require('express-validator');

// Create a rating (for both users and captains)
module.exports.createRating = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { rideId, rating, review } = req.body;
    
    // Get ride details
    const ride = await rideService.getRideDetails(rideId);
    
    // Check if ride exists and is completed
    if (!ride) {
      return res.status(404).json({ message: 'Ride not found' });
    }
    
    if (ride.status !== 'completed') {
      return res.status(400).json({ message: 'Rating can only be created for completed rides' });
    }
    
    // Determine who is rating whom
    let ratedBy, ratedFor, ratingData;
    
    if (req.user) {
      // User is rating the captain
      ratedBy = 'user';
      ratedFor = 'captain';
      
      // Check if user has already rated this ride
      const hasRated = await ratingService.checkRatingExists(rideId, ratedBy, ratedFor);
      if (hasRated) {
        return res.status(400).json({ message: 'You have already rated this ride' });
      }
      
      ratingData = {
        ride: rideId,
        ratedBy,
        ratedFor,
        user: req.user._id,
        captain: ride.captain._id,
        rating,
        review
      };
    } else if (req.captain) {
      // Captain is rating the user
      ratedBy = 'captain';
      ratedFor = 'user';
      
      // Check if captain has already rated this ride
      const hasRated = await ratingService.checkRatingExists(rideId, ratedBy, ratedFor);
      if (hasRated) {
        return res.status(400).json({ message: 'You have already rated this ride' });
      }
      
      ratingData = {
        ride: rideId,
        ratedBy,
        ratedFor,
        user: ride.user._id,
        captain: req.captain._id,
        rating,
        review
      };
    } else {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    
    // Create rating
    const newRating = await ratingService.createRating(ratingData);
    
    res.status(201).json({
      message: 'Rating created successfully',
      rating: newRating
    });
  } catch (error) {
    console.error('Error creating rating:', error);
    res.status(500).json({ message: 'Error creating rating', error: error.message });
  }
};

// Get user ratings
module.exports.getUserRatings = async (req, res) => {
  try {
    const userId = req.params.userId || req.user._id;
    
    const ratings = await ratingService.getUserRatings(userId);
    const averageRating = await ratingService.calculateUserAverageRating(userId);
    
    res.status(200).json({
      ratings,
      averageRating: averageRating.averageRating,
      totalRatings: averageRating.count
    });
  } catch (error) {
    console.error('Error getting user ratings:', error);
    res.status(500).json({ message: 'Error getting user ratings', error: error.message });
  }
};

// Get captain ratings
module.exports.getCaptainRatings = async (req, res) => {
  try {
    const captainId = req.params.captainId || req.captain._id;
    
    const ratings = await ratingService.getCaptainRatings(captainId);
    const averageRating = await ratingService.calculateCaptainAverageRating(captainId);
    
    res.status(200).json({
      ratings,
      averageRating: averageRating.averageRating,
      totalRatings: averageRating.count
    });
  } catch (error) {
    console.error('Error getting captain ratings:', error);
    res.status(500).json({ message: 'Error getting captain ratings', error: error.message });
  }
};
