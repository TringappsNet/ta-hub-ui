import { TextField } from "@mui/material";
import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import '../styles/resetPassword.css';
import CustomSnackbar from "./CustomSnackbar";

function ResetNew() {
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState("");
    const [snackbarVariant, setSnackbarVariant] = useState("success");
    const [token, setToken] = useState("");

    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        const urlParams = new URLSearchParams(location.search);
        const tokenFromUrl = urlParams.get('token');
        setToken(tokenFromUrl || ""); 
    }, [location]);
    
    const handleResetPassword = async (e) => {
        e.preventDefault();

        if (newPassword !== confirmPassword) {
            setErrorMessage("Passwords do not match");
            return;
        }

        try {
            const payload = new URLSearchParams({
                token: token,
                newPassword: newPassword
            });

            const response = await fetch("http://localhost:8080/api/auth/reset-password", {
                method: "POST",
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded"
                },
                body: payload.toString()
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(errorText);
            }
            const data = await response.text()
            setNewPassword("");
            setConfirmPassword("");
            setErrorMessage("");
            setSnackbarMessage(data);
            setSnackbarVariant("success");
            setTimeout(() => {
                navigate('/login');
            }, 2000);
            setSnackbarOpen(true);

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
                                    <label htmlFor="password" className="Email">Confirm Password</label>
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
                                    {errorMessage && <div className="error-message">{errorMessage}</div>}
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

export default ResetNew;
