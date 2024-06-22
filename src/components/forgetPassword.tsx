"use-client"
import { TextField } from "@mui/material";
import React,{ useState } from "react";
import { Link } from "react-router-dom";
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import '../styles/forgetPassowrd.css';
import CustomSnackbar from "./CustomSnackbar";


function ForgetPassword() {
    const [email, setEmail] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState("");
    const [snackbarVariant, setSnackbarVariant] = useState("success");

    const handleForgetPassword = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch("http://localhost:8080/api/auth/forgot-password", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ email })
            });

            if (!response.ok) {
                throw new Error("Failed to request reset link");
            }   
             const data = await response.text();
            setSnackbarMessage(data);
            setSnackbarVariant("success");
            setSnackbarOpen(true);

            // Reset form fields or show a success message
        } catch (error) {
            console.error("Error requesting reset link:", error.message);
            setSnackbarMessage("Error resetting password. Please try again later.");
            setSnackbarVariant("error");
            setSnackbarOpen(true);
            // Handle error, e.g., display error message to the user
        }
    };
    const handleCloseSnackbar = () => {
        setSnackbarOpen(false);
    };

 return(
    <div className="image">
    <div className="left">
    <div className="animation-container">
      <span className="word">t</span>
      <span className="word">r</span>
      <span className="word">i</span>
      <span className="word">n</span>
      <span className="word">g</span>
      <span className="word">a</span>
      <span className="word">p</span>
      <span className="word">p</span>
      <span className="word">s</span>
    </div>
    <div className="background-image"></div>
    </div>
    <div className="right">
    <div role="form" onKeyPress={(e) => { if (e.key === 'Enter') handleForgetPassword(e); }}>
        <form onSubmit={handleForgetPassword}>
        <div className="card1">
        <div className="form-container-forget">
            <div>
            <h1 className="gradient-text-center">Forget your Password?</h1>
            </div>
            <p className="text-top">Please enter your email address you’d like your 
password reset information sent to </p>
            <div className="text">
            <label htmlFor="email" className="Email-forget">Enter email address</label>
            <div className="input-container-forget">
                <TextField 
                className="input" 
                id="filled-basic-email" 
                variant="standard"
                type="text"
                name="email"
                placeholder="Email address" 
                onChange={(e) => setEmail(e.target.value)}

                />
            </div>
            </div>
            {/* <Link to="/reset-password" className="forget">
            Reset password?
            </Link> */}

            
            <button className="button-forget">
            Request reset link
            </button>

            <div className="login-secondary">
            <div className="text-center">
            <div className="link-container">
                <span>
                    <Link to="/login" className="back-to-login">
                       Back to Login
                    </Link>
                </span>
            </div>
            </div>
        </div>
        </div>
        </div>

        </form>
        </div>

    </div>
    <CustomSnackbar
                message={snackbarMessage}
                variant={snackbarVariant}
                onClose={handleCloseSnackbar}
                open={snackbarOpen}
            />
  </div>

 )   
}


export default ForgetPassword