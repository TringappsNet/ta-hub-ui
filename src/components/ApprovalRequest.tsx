import React, { useEffect, useState } from 'react';
import { Card, CardContent, Typography, Container, Box } from '@mui/material';
import { CheckCircleOutline, ErrorOutline } from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';

export default function ApprovalRequest() {
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState('');
  const [token, setToken] = useState<string>('');
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const tokenFromUrl = urlParams.get('token');
    setToken(tokenFromUrl || ""); 
  }, [location]);

  useEffect(() => {
    if (token) {
      approveRequirement(token);
    } else {
      setMessage('Invalid or missing token.');
      setStatus('error');
    }
  }, [token]);

  const approveRequirement = async (token: string) => {
    try {
      const response = await fetch(`http://localhost:8090/api/approve-requirement?token=${token}`, {
        method: 'POST',
      });

      console.log('Response status:', response.status);

      const responseText = await response.text();
      console.log('Response text:', responseText);

      if (response.ok) {
        setMessage('Your job openings have been successfully approved.');
        setStatus('success');
      } else {
        setMessage(responseText);
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
        navigate('/navbar');
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [status, navigate]);

  return (
    <Container disableGutters={true}>
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', overflow: 'hidden' }}>
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
