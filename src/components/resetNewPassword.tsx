import { TextField } from "@mui/material";
import React, { useState } from "react";
import '../styles/resetPassword.css';
import CustomSnackbar from "./CustomSnackbar";

function ResetPassword() {
    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState("");
    const [snackbarVariant, setSnackbarVariant] = useState('success');

    const handleResetPassword = async (e) => {
        e.preventDefault();

        try {
            const sessionId = localStorage.getItem("sessionId") || '';
            const email = localStorage.getItem("email") || '';

            console.log("Session ID:", sessionId);

            const response = await fetch("http://localhost:8090/api/auth/reset-new-password", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Session-Id": sessionId,
                    "Email": email
                },
                body: JSON.stringify({
                  email: email,           
                  oldPassword: oldPassword,  
                  newPassword: newPassword
                })
            });

            if (!response.ok) {
                const errorResponse = await response.text();
                throw new Error(errorResponse); 
            }
            const data = await response.text()
            // Show success message
            setSnackbarMessage(data);
            setSnackbarVariant("success");
            setSnackbarOpen(true);

            setOldPassword("");
            setNewPassword("");
            setConfirmPassword("");
        } catch (error) {
            console.error("Error resetting password:", error.message);
            setSnackbarMessage(error.message);
            setSnackbarVariant("error");
            setSnackbarOpen(true);
        }
    };

    const handleCloseSnackbar = () => {
        setSnackbarOpen(false);
    };

    return (
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
                <div role="form" onKeyPress={(e) => { if (e.key === 'Enter') handleResetPassword(e); }}>
                    <form onSubmit={handleResetPassword}>
                        <div className="card1">
                            <div className="form-container-reset">
                                <div>
                                    <h1 className="gradient-text-reset">Reset Password</h1>
                                </div>
                                <p className="text-top">Strong passwords include numbers, letters, and punctuation marks. </p>
                                <div className="text">
                                    <label htmlFor="password" className="Email"> Enter Old Password</label>
                                    <div className="input-container-reset">
                                        <TextField 
                                            className="input" 
                                            id="filled-basic-password" 
                                            variant="standard"
                                            type="password"
                                            name="password"
                                            placeholder="Old Password" 
                                            value={oldPassword}
                                            onChange={(e) => setOldPassword(e.target.value)}
                                        />
                                    </div>
                                    <label htmlFor="password" className="Email">Enter New Password</label>
                                    <div className="input-container-reset">
                                        <TextField 
                                            className="input" 
                                            id="filled-basic-oldpassword" 
                                            variant="standard"
                                            type="password"
                                            name="password"
                                            placeholder="New Password" 
                                            value={newPassword}
                                            onChange={(e) => setNewPassword(e.target.value)}
                                        />
                                    </div>
                                    <label htmlFor="password" className="Email">Enter Confirm Password</label>
                                    <div className="input-container-reset">
                                        <TextField 
                                            className="input" 
                                            id="filled-basic-conpassword" 
                                            variant="standard"
                                            type="password"
                                            name="password"
                                            placeholder="Confirm Password" 
                                            value={confirmPassword}
                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                        />
                                    </div>
                                </div>            
                                <button type="submit" className="button-reset">
                                    Submit
                                </button>
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
    );
}

export default ResetPassword;
