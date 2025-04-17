const userModel = require('../models/user.model');
const captainModel = require('../models/captain.model');
const rideModel = require('../models/ride.model');
const rideService = require('../services/ride.services');

// Initialize Socket.io
const initializeSocket = (io) => {
  io.on('connection', (socket) => {
    console.log(`New client connected: ${socket.id}`);

    // Handle user authentication
    socket.on('user-auth', async (userId) => {
      try {
        // Update user's socket ID in database
        await userModel.findByIdAndUpdate(userId, { socketId: socket.id });
        socket.join('users'); // Add to users room
        console.log(`User ${userId} authenticated with socket ${socket.id}`);
      } catch (error) {
        console.error('Error in user authentication:', error);
      }
    });

    // Handle captain authentication
    socket.on('captain-auth', async (captainId) => {
      try {
        // Update captain's socket ID in database
        await captainModel.findByIdAndUpdate(captainId, { socketId: socket.id });
        socket.join('captains'); // Add to captains room
        console.log(`Captain ${captainId} authenticated with socket ${socket.id}`);
      } catch (error) {
        console.error('Error in captain authentication:', error);
      }
    });

    // Handle location updates from captains
    socket.on('update-location', async (data) => {
      try {
        const { captainId, longitude, latitude } = data;

        // Update captain's location in database
        await captainModel.findByIdAndUpdate(captainId, {
          'location.longitude': longitude,
          'location.latitude': latitude,
        });

        // If this captain is assigned to a ride, emit location to the user
        const captain = await captainModel.findById(captainId);
        if (captain && !captain.isAvailable) {
          // Find the active ride for this captain
          const activeRide = await rideModel
            .findOne({
              captain: captainId,
              status: { $in: ['accepted', 'in-progress'] },
            })
            .populate('user');

          if (activeRide && activeRide.user && activeRide.user.socketId) {
            // Emit location update to the user
            io.to(activeRide.user.socketId).emit('captain-location', {
              rideId: activeRide._id,
              location: { longitude, latitude },
            });
          }
        }
      } catch (error) {
        console.error('Error updating location:', error);
      }
    });

    // Handle ride requests
    socket.on('request-ride', async (rideData) => {
      try {
        // Create ride in database
        const ride = await rideService.createRideRequest(rideData);

        // Find nearby captains
        const nearbyCaptains = await rideService.findNearbyCaptains(
          rideData.pickupLocation.coordinates.longitude,
          rideData.pickupLocation.coordinates.latitude,
          rideData.vehicleType
        );

        // Emit ride request to nearby captains
        nearbyCaptains.forEach(captain => {
          if (captain.socketId) {
            io.to(captain.socketId).emit('new-ride-request', {
              ride: {
                _id: ride._id,
                pickupLocation: ride.pickupLocation,
                dropLocation: ride.dropLocation,
                fare: ride.fare,
                distance: ride.distance,
                duration: ride.duration,
                vehicleType: ride.vehicleType
              },
              user: {
                _id: ride.user._id,
                fullname: ride.user.fullname
              }
            });
          }
        });

        // Emit to the user that ride request is being processed
        socket.emit('ride-requested', {
          rideId: ride._id,
          captainsNotified: nearbyCaptains.length
        });
      } catch (error) {
        console.error('Error in ride request:', error);
        socket.emit('ride-request-error', { message: error.message });
      }
    });

    // Handle ride acceptance
    socket.on('accept-ride', async (data) => {
      try {
        const { rideId, captainId } = data;

        // Update ride status to accepted
        const ride = await rideService.updateRideStatus(rideId, 'accepted', captainId);

        // Update captain availability
        await captainModel.findByIdAndUpdate(captainId, { isAvailable: false });

        // Notify the user
        if (ride && ride.user && ride.user.socketId) {
          io.to(ride.user.socketId).emit('ride-accepted', {
            rideId,
            captain: {
              _id: ride.captain._id,
              fullname: ride.captain.fullname,
              vehicleNumber: ride.captain.vehicleNumber,
              vehicleColor: ride.captain.vehicleColor,
              vehicleType: ride.captain.vehicleType,
              location: ride.captain.location
            }
          });
        }

        // Notify other captains that the ride is no longer available
        socket.to('captains').emit('ride-taken', { rideId });
      } catch (error) {
        console.error('Error in ride acceptance:', error);
        socket.emit('ride-accept-error', { message: error.message });
      }
    });

    // Handle ride start
    socket.on('start-ride', async (data) => {
      try {
        const { rideId } = data;

        // Update ride status to in-progress
        const ride = await rideService.updateRideStatus(rideId, 'in-progress');

        // Notify the user
        if (ride && ride.user && ride.user.socketId) {
          io.to(ride.user.socketId).emit('ride-started', { rideId });
        }
      } catch (error) {
        console.error('Error starting ride:', error);
        socket.emit('ride-start-error', { message: error.message });
      }
    });

    // Handle ride completion
    socket.on('complete-ride', async (data) => {
      try {
        const { rideId, captainId } = data;

        // Update ride status to completed
        const ride = await rideService.updateRideStatus(rideId, 'completed');

        // Update captain availability
        await captainModel.findByIdAndUpdate(captainId, { isAvailable: true });

        // Notify the user
        if (ride && ride.user && ride.user.socketId) {
          io.to(ride.user.socketId).emit('ride-completed', {
            rideId,
            fare: ride.fare,
            duration: ride.duration,
            distance: ride.distance
          });
        }
      } catch (error) {
        console.error('Error completing ride:', error);
        socket.emit('ride-complete-error', { message: error.message });
      }
    });

    // Handle ride cancellation
    socket.on('cancel-ride', async (data) => {
      try {
        const { rideId, reason, cancelledBy } = data;

        // Cancel the ride
        const ride = await rideService.cancelRide(rideId, cancelledBy, reason);

        // If cancelled by user, notify captain
        if (cancelledBy === 'user' && ride.captain && ride.captain.socketId) {
          io.to(ride.captain.socketId).emit('ride-cancelled', {
            rideId,
            reason
          });
        }

        // If cancelled by captain, notify user
        if (cancelledBy === 'captain' && ride.user && ride.user.socketId) {
          io.to(ride.user.socketId).emit('ride-cancelled', {
            rideId,
            reason
          });

          // Update captain availability
          await captainModel.findByIdAndUpdate(ride.captain, { isAvailable: true });
        }
      } catch (error) {
        console.error('Error cancelling ride:', error);
        socket.emit('ride-cancel-error', { message: error.message });
      }
    });

    // Handle disconnection
    socket.on('disconnect', () => {
      console.log(`Client disconnected: ${socket.id}`);
    });
  });
};

module.exports = { initializeSocket };
