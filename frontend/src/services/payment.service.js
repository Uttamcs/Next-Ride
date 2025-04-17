import api from './api';

const PaymentService = {
  // Get user's payment methods
  getPaymentMethods: async () => {
    try {
      const response = await api.get('/payments/methods');
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch payment methods' };
    }
  },

  // Add a new payment method
  addPaymentMethod: async (paymentData) => {
    try {
      const response = await api.post('/payments/methods', paymentData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to add payment method' };
    }
  },

  // Delete a payment method
  deletePaymentMethod: async (paymentMethodId) => {
    try {
      const response = await api.delete(`/payments/methods/${paymentMethodId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to delete payment method' };
    }
  },

  // Process payment for a ride
  processPayment: async (rideId, paymentMethodId) => {
    try {
      const response = await api.post('/payments/process', {
        rideId,
        paymentMethodId
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Payment processing failed' };
    }
  },

  // Get payment history
  getPaymentHistory: async () => {
    try {
      const response = await api.get('/payments/history');
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch payment history' };
    }
  },
};

export default PaymentService;
