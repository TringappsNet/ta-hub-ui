import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const GoogleCallback = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const googleSignIn = 'http://localhost:8080/api/auth/google';
  const googleAPI = 'https://www.googleapis.com/oauth2/v2/userinfo';


  useEffect(() => {
    if (location.hash) {
      const params = new URLSearchParams(location.hash.slice(1));
      const accessToken = params.get('access_token');
      const tokenType = params.get('token_type');

      fetch(googleAPI, {
        headers: {
          Authorization: `${tokenType} ${accessToken}`
        }
      })
      .then(response => response.json())
      .then(data => {
        const email = data.email;
        const username = data.name
        const gAccessToken = accessToken
        localStorage.setItem('email', email);

       
        fetch(googleSignIn, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ email, username , gAccessToken})
        })
        .then(response => {
          if (response.ok) {
            console.log('Successfully sent data to the backend');
          } else {
            console.error('Error sending data to the backend');
          }
        })
        .catch(error => {
          console.error('Error sending data to the backend:', error);
        });

        navigate('/navbar');
      })
      .catch(error => {
        console.error('Error fetching email:', error);
      });
    }
  }, [location, navigate]);

  return null;
};

export default GoogleCallback;
