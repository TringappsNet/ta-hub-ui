import React, { useEffect, useState } from 'react';
import { Card, CardContent, Typography, Container, Box } from '@mui/material';
import { CheckCircleOutline, ErrorOutline } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

export default function ApprovalRequest() {
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState('');
  const navigate = useNavigate();
  
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');
    
    if (token) {
      approveRequirement(token);
    } else {
      setMessage('Invalid or missing token.');
      setStatus('error');
    }
  }, []);
  
  const approveRequirement = async (token) => {
    try {
      const response = await fetch(`http://localhost:8080/api/approve-requirement?token=${token}`, {
        method: 'POST',
      });

      if (response.ok) {
        setMessage('Your job openings have been successfully approved.');
        setStatus('success');
      } else {
        const errorText = await response.text();
        setMessage(errorText);
        setStatus('error');
      }
    } catch (error) {
      console.error('Error approving requirement:', error);
      setMessage('An error occurred while approving the requirement. Please try again later.');
      setStatus('error');
    }
  };

  useEffect(() => {
    if (status) {
      const timer = setTimeout(() => {
        navigate('/navbar'); // Redirect to the navbar page
      }, 3000);

      return () => clearTimeout(timer); // Cleanup the timer on component unmount
    }
  }, [status, navigate]);

  return (
    <Container>
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <Card sx={{ minWidth: 275 }}>
          <CardContent sx={{ textAlign: 'center' }}>
            {status === 'success' ? (
              <CheckCircleOutline sx={{ fontSize: 60, color: 'green' }} />
            ) : (
              <ErrorOutline sx={{ fontSize: 60, color: 'red' }} />
            )}
            <Typography variant="h5" component="div" sx={{ mt: 2 }}>
              {status === 'success' ? 'Openings Approved!' : 'Approval Failed'}
            </Typography>
            <Typography sx={{ mt: 1.5 }} color="text.secondary">
              {message}
            </Typography>
          </CardContent>
        </Card>
      </Box>
    </Container>
  );
}
