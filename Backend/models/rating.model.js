const mongoose = require('mongoose');

const ratingSchema = new mongoose.Schema({
  ride: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ride',
    required: true
  },
  ratedBy: {
    type: String,
    enum: ['user', 'captain'],
    required: true
  },
  ratedFor: {
    type: String,
    enum: ['user', 'captain'],
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user'
  },
  captain: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'captain'
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  review: {
    type: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Validation to ensure either user or captain is provided based on ratedFor
ratingSchema.pre('validate', function(next) {
  if (this.ratedFor === 'user' && !this.user) {
    return next(new Error('User ID is required when rating a user'));
  }
  if (this.ratedFor === 'captain' && !this.captain) {
    return next(new Error('Captain ID is required when rating a captain'));
  }
  next();
});

const ratingModel = mongoose.model('rating', ratingSchema);
module.exports = ratingModel;
