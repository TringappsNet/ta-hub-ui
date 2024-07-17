import React, { forwardRef, useImperativeHandle } from 'react';
 

const GoogleSign = forwardRef((props, ref) => {
 

  useImperativeHandle(ref, () => ({
    signIn: () => {
      
      const baseUrl = window.location.origin;  

       
      const redirectUri = `${baseUrl}/google-callback`;

       
      const clientId = "750806534118-45qc3e7ii0619vrbr1roqc0d08hgpihc.apps.googleusercontent.com";
      const scope = encodeURIComponent("email profile");
      const responseType = "token";

       
      window.location.href = `https://accounts.google.com/o/oauth2/auth?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=${responseType}&scope=${scope}`;
    }
  }));

  return null;  
});

export default GoogleSign;
