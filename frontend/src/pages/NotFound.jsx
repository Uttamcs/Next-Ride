import { Link } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Button,
  Paper
} from '@mui/material';
import { Home, DirectionsCar } from '@mui/icons-material';

const NotFound = () => {
  return (
    <Container maxWidth="md" sx={{ py: 8 }}>
      <Paper
        elevation={3}
        sx={{
          p: { xs: 4, md: 6 },
          borderRadius: 2,
          textAlign: 'center',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center'
        }}
      >
        <DirectionsCar sx={{ fontSize: 100, color: 'primary.main', mb: 2 }} />
        
        <Typography variant="h1" component="h1" fontWeight="bold" sx={{ mb: 2 }}>
          404
        </Typography>
        
        <Typography variant="h4" component="h2" gutterBottom>
          Page Not Found
        </Typography>
        
        <Typography variant="body1" color="text.secondary" sx={{ mb: 4, maxWidth: 500 }}>
          Oops! The page you're looking for seems to have taken a wrong turn. 
          It might have been moved, deleted, or never existed in the first place.
        </Typography>
        
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', justifyContent: 'center' }}>
          <Button
            component={Link}
            to="/"
            variant="contained"
            startIcon={<Home />}
            size="large"
          >
            Back to Home
          </Button>
          
          <Button
            component={Link}
            to="/book-ride"
            variant="outlined"
            startIcon={<DirectionsCar />}
            size="large"
          >
            Book a Ride
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default NotFound;
