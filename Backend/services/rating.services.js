const ratingModel = require('../models/rating.model');
const userModel = require('../models/user.model');
const captainModel = require('../models/captain.model');

// Create a new rating
const createRating = async (ratingData) => {
  try {
    const rating = await ratingModel.create(ratingData);
    return rating;
  } catch (error) {
    throw new Error(`Error creating rating: ${error.message}`);
  }
};

// Get ratings for a user
const getUserRatings = async (userId) => {
  try {
    const ratings = await ratingModel.find({
      user: userId,
      ratedFor: 'user'
    }).populate('captain', 'fullname');
    
    return ratings;
  } catch (error) {
    throw new Error(`Error getting user ratings: ${error.message}`);
  }
};

// Get ratings for a captain
const getCaptainRatings = async (captainId) => {
  try {
    const ratings = await ratingModel.find({
      captain: captainId,
      ratedFor: 'captain'
    }).populate('user', 'fullname');
    
    return ratings;
  } catch (error) {
    throw new Error(`Error getting captain ratings: ${error.message}`);
  }
};

// Calculate average rating for a user
const calculateUserAverageRating = async (userId) => {
  try {
    const result = await ratingModel.aggregate([
      {
        $match: {
          user: userId,
          ratedFor: 'user'
        }
      },
      {
        $group: {
          _id: null,
          averageRating: { $avg: '$rating' },
          count: { $sum: 1 }
        }
      }
    ]);
    
    if (result.length === 0) {
      return { averageRating: 0, count: 0 };
    }
    
    return {
      averageRating: Math.round(result[0].averageRating * 10) / 10, // Round to 1 decimal place
      count: result[0].count
    };
  } catch (error) {
    throw new Error(`Error calculating user average rating: ${error.message}`);
  }
};

// Calculate average rating for a captain
const calculateCaptainAverageRating = async (captainId) => {
  try {
    const result = await ratingModel.aggregate([
      {
        $match: {
          captain: captainId,
          ratedFor: 'captain'
        }
      },
      {
        $group: {
          _id: null,
          averageRating: { $avg: '$rating' },
          count: { $sum: 1 }
        }
      }
    ]);
    
    if (result.length === 0) {
      return { averageRating: 0, count: 0 };
    }
    
    return {
      averageRating: Math.round(result[0].averageRating * 10) / 10, // Round to 1 decimal place
      count: result[0].count
    };
  } catch (error) {
    throw new Error(`Error calculating captain average rating: ${error.message}`);
  }
};

// Check if a rating exists for a specific ride
const checkRatingExists = async (rideId, ratedBy, ratedFor) => {
  try {
    const rating = await ratingModel.findOne({
      ride: rideId,
      ratedBy,
      ratedFor
    });
    
    return !!rating;
  } catch (error) {
    throw new Error(`Error checking if rating exists: ${error.message}`);
  }
};

module.exports = {
  createRating,
  getUserRatings,
  getCaptainRatings,
  calculateUserAverageRating,
  calculateCaptainAverageRating,
  checkRatingExists
};
