# Next Ride - Vehicle Rental System

Next Ride is a full-stack vehicle rental application similar to Uber and Ola. It allows users to book rides and captains (drivers) to accept and complete those rides.

## Features

- User and Captain Authentication
- Real-time Ride Booking
- Location Tracking
- Payment Processing
- Rating System
- Multiple Vehicle Types (Car, Bike, Auto)

## Tech Stack

### Backend

- Node.js
- Express.js
- MongoDB
- Socket.io for real-time communication
- JWT for authentication

### Frontend (To be implemented)

- React.js
- Redux for state management
- Google Maps API for maps and location
- Socket.io client for real-time updates

## Project Structure

```
Next Ride/
├── Backend/
│   ├── controllers/     # Request handlers
│   ├── models/          # Database models
│   ├── routes/          # API routes
│   ├── services/        # Business logic
│   ├── middleware/      # Middleware functions
│   ├── db/              # Database connection
│   ├── app.js           # Express app setup
│   └── server.js        # Server entry point
└── Frontend/            # To be implemented
```

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- MongoDB
- npm or yarn

### Installation

1. Clone the repository

   ```
   git clone https://github.com/yourusername/next-ride.git
   cd next-ride
   ```

2. Install backend dependencies

   ```
   cd Backend
   npm install
   ```

3. Create a `.env` file in the Backend directory (use `.env.example` as a template)

   ```
   cp .env.example .env
   ```

4. Start the backend server
   ```
   npm run dev
   ```

## API Documentation

The API documentation is available in the [Backend/readme.md](Backend/readme.md) file.

## Future Enhancements

- Implement Frontend with React.js
- Add Google Maps integration
- Implement payment gateway integration
- Add admin dashboard
- Add notifications system
- Implement ride scheduling

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Inspired by Uber and Ola ride-sharing applications
