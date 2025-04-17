import api from './api';

const ServicesService = {
  // Get all services
  getAllServices: async () => {
    try {
      // In a real application, this would fetch from an API endpoint
      // For now, we'll return mock data
      return {
        services: [
          {
            id: 1,
            name: 'Standard Ride',
            description: 'Affordable rides for everyday travel',
            icon: 'DirectionsCar',
            features: [
              'Affordable rates',
              'Available 24/7',
              'Accommodates up to 4 passengers',
              'Air-conditioned vehicles'
            ],
            price: 'Starting at $5'
          },
          {
            id: 2,
            name: 'Premium Ride',
            description: 'Luxury vehicles for a premium experience',
            icon: 'AirportShuttle',
            features: [
              'High-end vehicles',
              'Professional drivers',
              'Complimentary water',
              'Extra legroom',
              'Premium entertainment options'
            ],
            price: 'Starting at $15'
          },
          {
            id: 3,
            name: 'Express Pool',
            description: 'Share your ride and save money',
            icon: 'SupervisedUserCircle',
            features: [
              'Most affordable option',
              'Environmentally friendly',
              'Meet new people',
              'Reduced traffic congestion'
            ],
            price: 'Starting at $3'
          },
          {
            id: 4,
            name: 'XL Ride',
            description: 'Larger vehicles for groups or extra space',
            icon: 'AirportShuttle',
            features: [
              'Accommodates up to 6 passengers',
              'Extra space for luggage',
              'Perfect for airport transfers',
              'Ideal for group outings'
            ],
            price: 'Starting at $12'
          },
          {
            id: 5,
            name: 'Hourly Rental',
            description: 'Rent a car with driver by the hour',
            icon: 'Schedule',
            features: [
              'Flexible hourly packages',
              'Multiple stops',
              'Wait and return service',
              'Perfect for shopping trips or errands'
            ],
            price: 'Starting at $20/hour'
          },
          {
            id: 6,
            name: 'Airport Transfer',
            description: 'Reliable airport pickups and drop-offs',
            icon: 'Flight',
            features: [
              'Flight tracking',
              'Meet & greet service',
              'Help with luggage',
              'No extra charge for flight delays'
            ],
            price: 'Starting at $25'
          }
        ]
      };
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch services' };
    }
  },

  // Get service by ID
  getServiceById: async (serviceId) => {
    try {
      // In a real application, this would fetch from an API endpoint
      // For now, we'll filter from our mock data
      const allServices = await ServicesService.getAllServices();
      const service = allServices.services.find(s => s.id === parseInt(serviceId));
      
      if (!service) {
        throw { message: 'Service not found' };
      }
      
      return { service };
    } catch (error) {
      throw error.response?.data || error || { message: 'Failed to fetch service' };
    }
  }
};

export default ServicesService;
