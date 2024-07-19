import React, { forwardRef, useImperativeHandle } from 'react';
import { clientId, scope, responseType } from './authConfig'; 
 

const GoogleSign = forwardRef((props, ref) => {
 

  useImperativeHandle(ref, () => ({
    signIn: () => {
      
      const baseUrl = window.location.origin;  

       
      const redirectUri = `${baseUrl}/google-callback`;

       
      

       
      window.location.href = `https://accounts.google.com/o/oauth2/auth?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=${responseType}&scope=${scope}`;
    }
  }));

  return null;  
});

export default GoogleSign;
