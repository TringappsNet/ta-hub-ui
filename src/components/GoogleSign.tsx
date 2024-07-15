// src/components/GoogleSignIn.js

import React, { useEffect, useState } from 'react';
import {jwtDecode} from 'jwt-decode';
import Navbar from './Navbar'; 

const GoogleSign = () => {
  const [email, setEmail] = useState('');

  useEffect(() => {
    if (window.google && window.google.accounts && window.google.accounts.id) {
      window.google.accounts.id.initialize({
        client_id: "750806534118-45qc3e7ii0619vrbr1roqc0d08hgpihc.apps.googleusercontent.com",
        callback: handleCallbackResponse
      });
      window.google.accounts.id.renderButton(
        document.getElementById("signInDiv"),
        { theme: "outline", size: "large" }
      );
    } else {
      console.error('Google accounts.id library not loaded.');
    }
  }, []);

  function handleCallbackResponse(response) {
    console.log("Encoded JWT ID token:" + response.credential);
    let userObject = jwtDecode(response.credential);
    console.log(userObject.email);
    setEmail(userObject.email);
  }

  return (
    <div>
      <div id="signInDiv"></div>
      {email && <Navbar email={email} />}
    </div>
  );
};

export default GoogleSign;
