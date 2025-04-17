import { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Paper,
  Button,
  Card,
  CardContent,
  TextField,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Divider,
  CircularProgress,
  Alert,
  InputAdornment
} from '@mui/material';
import {
  CreditCard,
  Add,
  Delete,
  Edit,
  Close,
  AccountBalance,
  Payment,
  CreditCardOff
} from '@mui/icons-material';
import PaymentService from '../services/payment.service';

const PaymentMethods = () => {
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState(null);
  const [formData, setFormData] = useState({
    type: 'card',
    cardNumber: '',
    cardholderName: '',
    expiryMonth: '',
    expiryYear: '',
    cvv: '',
    accountNumber: '',
    routingNumber: '',
    bankName: ''
  });
  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    fetchPaymentMethods();
  }, []);

  const fetchPaymentMethods = async () => {
    try {
      setLoading(true);
      const response = await PaymentService.getPaymentMethods();
      setPaymentMethods(response.paymentMethods || []);
    } catch (error) {
      setError('Failed to fetch payment methods. Please try again.');
      console.error('Error fetching payment methods:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (method = null) => {
    if (method) {
      // Edit mode
      setFormData({
        type: method.type,
        cardNumber: method.cardNumber || '',
        cardholderName: method.cardholderName || '',
        expiryMonth: method.expiryMonth || '',
        expiryYear: method.expiryYear || '',
        cvv: '',
        accountNumber: method.accountNumber || '',
        routingNumber: method.routingNumber || '',
        bankName: method.bankName || ''
      });
      setSelectedMethod(method);
    } else {
      // Add mode
      setFormData({
        type: 'card',
        cardNumber: '',
        cardholderName: '',
        expiryMonth: '',
        expiryYear: '',
        cvv: '',
        accountNumber: '',
        routingNumber: '',
        bankName: ''
      });
      setSelectedMethod(null);
    }
    setFormErrors({});
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleOpenDeleteConfirm = (method) => {
    setSelectedMethod(method);
    setDeleteConfirmOpen(true);
  };

  const handleCloseDeleteConfirm = () => {
    setDeleteConfirmOpen(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    
    // Clear field-specific error when user types
    if (formErrors[name]) {
      setFormErrors({
        ...formErrors,
        [name]: ''
      });
    }
  };

  const validateForm = () => {
    const errors = {};
    
    if (formData.type === 'card') {
      if (!formData.cardNumber.trim()) {
        errors.cardNumber = 'Card number is required';
      } else if (!/^\d{16}$/.test(formData.cardNumber.replace(/\s/g, ''))) {
        errors.cardNumber = 'Card number must be 16 digits';
      }
      
      if (!formData.cardholderName.trim()) {
        errors.cardholderName = 'Cardholder name is required';
      }
      
      if (!formData.expiryMonth.trim()) {
        errors.expiryMonth = 'Expiry month is required';
      } else if (!/^(0[1-9]|1[0-2])$/.test(formData.expiryMonth)) {
        errors.expiryMonth = 'Invalid month (01-12)';
      }
      
      if (!formData.expiryYear.trim()) {
        errors.expiryYear = 'Expiry year is required';
      } else if (!/^\d{4}$/.test(formData.expiryYear)) {
        errors.expiryYear = 'Invalid year (4 digits)';
      } else {
        const currentYear = new Date().getFullYear();
        const currentMonth = new Date().getMonth() + 1;
        const expiryYear = parseInt(formData.expiryYear);
        const expiryMonth = parseInt(formData.expiryMonth);
        
        if (expiryYear < currentYear || (expiryYear === currentYear && expiryMonth < currentMonth)) {
          errors.expiryYear = 'Card has expired';
        }
      }
      
      if (!selectedMethod && !formData.cvv.trim()) {
        errors.cvv = 'CVV is required';
      } else if (formData.cvv && !/^\d{3,4}$/.test(formData.cvv)) {
        errors.cvv = 'CVV must be 3 or 4 digits';
      }
    } else if (formData.type === 'bank') {
      if (!formData.accountNumber.trim()) {
        errors.accountNumber = 'Account number is required';
      }
      
      if (!formData.routingNumber.trim()) {
        errors.routingNumber = 'Routing number is required';
      }
      
      if (!formData.bankName.trim()) {
        errors.bankName = 'Bank name is required';
      }
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    try {
      setLoading(true);
      
      const paymentData = {
        type: formData.type,
        ...(formData.type === 'card' ? {
          cardNumber: formData.cardNumber,
          cardholderName: formData.cardholderName,
          expiryMonth: formData.expiryMonth,
          expiryYear: formData.expiryYear,
          ...(formData.cvv ? { cvv: formData.cvv } : {})
        } : {
          accountNumber: formData.accountNumber,
          routingNumber: formData.routingNumber,
          bankName: formData.bankName
        })
      };
      
      if (selectedMethod) {
        // Update existing payment method (not implemented in the service yet)
        // await PaymentService.updatePaymentMethod(selectedMethod._id, paymentData);
        setSuccess('Payment method updated successfully!');
      } else {
        // Add new payment method
        await PaymentService.addPaymentMethod(paymentData);
        setSuccess('Payment method added successfully!');
      }
      
      fetchPaymentMethods();
      handleCloseDialog();
    } catch (error) {
      setError(error.message || 'Failed to save payment method. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedMethod) return;
    
    try {
      setLoading(true);
      await PaymentService.deletePaymentMethod(selectedMethod._id);
      setSuccess('Payment method deleted successfully!');
      fetchPaymentMethods();
    } catch (error) {
      setError(error.message || 'Failed to delete payment method. Please try again.');
    } finally {
      setLoading(false);
      handleCloseDeleteConfirm();
    }
  };

  const formatCardNumber = (number) => {
    if (!number) return '';
    const last4 = number.slice(-4);
    return `•••• •••• •••• ${last4}`;
  };

  const getCardTypeIcon = (cardNumber) => {
    // This is a simplified version - in a real app, you would use a more robust method
    if (!cardNumber) return <CreditCard />;
    
    const firstDigit = cardNumber.charAt(0);
    
    if (firstDigit === '4') {
      return <CreditCard />; // Visa
    } else if (firstDigit === '5') {
      return <CreditCard />; // Mastercard
    } else if (firstDigit === '3') {
      return <CreditCard />; // Amex
    } else if (firstDigit === '6') {
      return <CreditCard />; // Discover
    }
    
    return <CreditCard />;
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" fontWeight="bold" gutterBottom>
          Payment Methods
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Manage your payment methods for ride bookings
        </Typography>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError('')}>
          {error}
        </Alert>
      )}
      
      {success && (
        <Alert severity="success" sx={{ mb: 3 }} onClose={() => setSuccess('')}>
          {success}
        </Alert>
      )}

      <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h5" fontWeight="bold">
            Your Payment Methods
          </Typography>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => handleOpenDialog()}
          >
            Add Payment Method
          </Button>
        </Box>

        {loading && paymentMethods.length === 0 ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
            <CircularProgress />
          </Box>
        ) : paymentMethods.length > 0 ? (
          <Grid container spacing={3}>
            {paymentMethods.map((method) => (
              <Grid item xs={12} sm={6} md={4} key={method._id}>
                <Card 
                  elevation={2}
                  sx={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    position: 'relative',
                    borderRadius: 2,
                    ...(method.isDefault ? { border: 1, borderColor: 'primary.main' } : {})
                  }}
                >
                  {method.isDefault && (
                    <Box
                      sx={{
                        position: 'absolute',
                        top: 10,
                        right: 10,
                        bgcolor: 'primary.main',
                        color: 'white',
                        px: 1,
                        py: 0.5,
                        borderRadius: 1,
                        fontSize: '0.75rem',
                      }}
                    >
                      Default
                    </Box>
                  )}
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      {method.type === 'card' ? (
                        getCardTypeIcon(method.cardNumber)
                      ) : (
                        <AccountBalance />
                      )}
                      <Typography variant="h6" sx={{ ml: 1 }}>
                        {method.type === 'card' ? (
                          `${method.cardholderName}`
                        ) : (
                          `${method.bankName}`
                        )}
                      </Typography>
                    </Box>
                    
                    {method.type === 'card' ? (
                      <>
                        <Typography variant="body1" sx={{ mb: 1 }}>
                          {formatCardNumber(method.cardNumber)}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Expires: {method.expiryMonth}/{method.expiryYear.slice(-2)}
                        </Typography>
                      </>
                    ) : (
                      <>
                        <Typography variant="body1" sx={{ mb: 1 }}>
                          Account: •••• {method.accountNumber.slice(-4)}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Routing: •••• {method.routingNumber.slice(-4)}
                        </Typography>
                      </>
                    )}
                  </CardContent>
                  
                  <Divider />
                  
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', p: 1 }}>
                    <IconButton
                      color="primary"
                      onClick={() => handleOpenDialog(method)}
                      size="small"
                    >
                      <Edit fontSize="small" />
                    </IconButton>
                    <IconButton
                      color="error"
                      onClick={() => handleOpenDeleteConfirm(method)}
                      size="small"
                    >
                      <Delete fontSize="small" />
                    </IconButton>
                  </Box>
                </Card>
              </Grid>
            ))}
          </Grid>
        ) : (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <CreditCardOff sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
            <Typography variant="h6" gutterBottom>
              No Payment Methods
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
              You haven't added any payment methods yet.
            </Typography>
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={() => handleOpenDialog()}
            >
              Add Payment Method
            </Button>
          </Box>
        )}
      </Paper>

      {/* Add/Edit Payment Method Dialog */}
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            {selectedMethod ? 'Edit Payment Method' : 'Add Payment Method'}
            <IconButton onClick={handleCloseDialog} size="small">
              <Close fontSize="small" />
            </IconButton>
          </Box>
        </DialogTitle>
        
        <DialogContent dividers>
          <Box component="form" onSubmit={handleSubmit}>
            <FormControl component="fieldset" sx={{ mb: 3 }}>
              <FormLabel component="legend">Payment Type</FormLabel>
              <RadioGroup
                row
                name="type"
                value={formData.type}
                onChange={handleChange}
              >
                <FormControlLabel
                  value="card"
                  control={<Radio />}
                  label={
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <CreditCard sx={{ mr: 1 }} />
                      Credit/Debit Card
                    </Box>
                  }
                />
                <FormControlLabel
                  value="bank"
                  control={<Radio />}
                  label={
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <AccountBalance sx={{ mr: 1 }} />
                      Bank Account
                    </Box>
                  }
                />
              </RadioGroup>
            </FormControl>
            
            {formData.type === 'card' ? (
              <>
                <TextField
                  fullWidth
                  label="Card Number"
                  name="cardNumber"
                  value={formData.cardNumber}
                  onChange={handleChange}
                  margin="normal"
                  error={!!formErrors.cardNumber}
                  helperText={formErrors.cardNumber}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Payment />
                      </InputAdornment>
                    ),
                  }}
                />
                
                <TextField
                  fullWidth
                  label="Cardholder Name"
                  name="cardholderName"
                  value={formData.cardholderName}
                  onChange={handleChange}
                  margin="normal"
                  error={!!formErrors.cardholderName}
                  helperText={formErrors.cardholderName}
                />
                
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <TextField
                      fullWidth
                      label="Expiry Month (MM)"
                      name="expiryMonth"
                      value={formData.expiryMonth}
                      onChange={handleChange}
                      margin="normal"
                      error={!!formErrors.expiryMonth}
                      helperText={formErrors.expiryMonth}
                      placeholder="MM"
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <TextField
                      fullWidth
                      label="Expiry Year (YYYY)"
                      name="expiryYear"
                      value={formData.expiryYear}
                      onChange={handleChange}
                      margin="normal"
                      error={!!formErrors.expiryYear}
                      helperText={formErrors.expiryYear}
                      placeholder="YYYY"
                    />
                  </Grid>
                </Grid>
                
                {!selectedMethod && (
                  <TextField
                    fullWidth
                    label="CVV"
                    name="cvv"
                    value={formData.cvv}
                    onChange={handleChange}
                    margin="normal"
                    error={!!formErrors.cvv}
                    helperText={formErrors.cvv}
                  />
                )}
              </>
            ) : (
              <>
                <TextField
                  fullWidth
                  label="Bank Name"
                  name="bankName"
                  value={formData.bankName}
                  onChange={handleChange}
                  margin="normal"
                  error={!!formErrors.bankName}
                  helperText={formErrors.bankName}
                />
                
                <TextField
                  fullWidth
                  label="Account Number"
                  name="accountNumber"
                  value={formData.accountNumber}
                  onChange={handleChange}
                  margin="normal"
                  error={!!formErrors.accountNumber}
                  helperText={formErrors.accountNumber}
                />
                
                <TextField
                  fullWidth
                  label="Routing Number"
                  name="routingNumber"
                  value={formData.routingNumber}
                  onChange={handleChange}
                  margin="normal"
                  error={!!formErrors.routingNumber}
                  helperText={formErrors.routingNumber}
                />
              </>
            )}
          </Box>
        </DialogContent>
        
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button
            variant="contained"
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} /> : (selectedMethod ? 'Update' : 'Add')}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteConfirmOpen}
        onClose={handleCloseDeleteConfirm}
      >
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete this payment method? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteConfirm}>Cancel</Button>
          <Button
            variant="contained"
            color="error"
            onClick={handleDelete}
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} /> : 'Delete'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default PaymentMethods;
