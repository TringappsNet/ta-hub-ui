import { TextField } from "@mui/material";
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import '../styles/login.css';
import CustomSnackbar from "./CustomSnackbar";

function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState("");
    const [snackbarVariant, setSnackbarVariant] = useState('success');
    const [loading, setLoading] = useState(false);

    const handleLogin = async (e) => {
        e.preventDefault();

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const isEmailValid = emailRegex.test(email);
        const isPasswordValid = password.length >= 8;
        const userCredentials = { email, password };
        const DISPLAY_MSG={
            EMPTY_FIELD:"Please fill all fields!",
            EMAIL:"Invalid email address!",
            PASSWORD: "Password must be at least 8 characters long!",
            SERVER_PROB: "Oops! Something went wrong on our end. Please try again later.",
            CLIENT_PROB: "Oops! Please try again later.",
         }

        if (!email || !password) {
            setSnackbarOpen(true);
            setSnackbarMessage(DISPLAY_MSG.EMPTY_FIELD);
            setSnackbarVariant("error");
            return;
        }

        if (!isEmailValid) {
            setSnackbarOpen(true);
            setSnackbarMessage(DISPLAY_MSG.EMAIL);
            setSnackbarVariant("error");
            return;
        }

        if (!isPasswordValid) {
            setSnackbarOpen(true);
            setSnackbarMessage(DISPLAY_MSG.PASSWORD);
            setSnackbarVariant("error");
            return;
        }

        try {
            setLoading(true);
            const response = await fetch("http://localhost:8080/api/auth/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(userCredentials),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || DISPLAY_MSG.CLIENT_PROB);
            }

            const data = await response.json();

    
            localStorage.setItem('isLoggedIn', 'true');
            localStorage.setItem('email', email);
            localStorage.setItem('sessionId', data.sessionId);

            localStorage.setItem('isLoggedIn', 'true');
            localStorage.setItem('email', email);
            localStorage.setItem('sessionId', data.sessionId);

            setSnackbarOpen(true);
            setSnackbarMessage(data.message);
            setSnackbarVariant("success");
            setTimeout(() => {
                setLoading(false);
                navigate('/navbar');
            }, 2000);

        } catch (error) {
            console.error("Error logging in:", error.message);
            if(error.message === "Failed to fetch"){
            setSnackbarOpen(true);
            setSnackbarMessage(DISPLAY_MSG.SERVER_PROB);
            setSnackbarVariant("error");
            }
        else{
            setSnackbarOpen(true);
            setSnackbarMessage(error.message);
            setSnackbarVariant("error");
        }
           
        }
    };

    const handleCloseSnackbar = () => {
        setSnackbarOpen(false);
        setSnackbarMessage("");
    };

    const handleGoogleSignIn = async () => {
        try {
            const response = await fetch("http://localhost:8080/api/google-sign-in", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json"
                },
                credentials: 'include'
            });
    
            // Check if the response content type is JSON
            const contentType = response.headers.get("content-type");
            if (contentType && contentType.indexOf("application/json") !== -1) {
                const authData = await response.json();
    
                // Store authentication data in localStorage
                localStorage.setItem('isLoggedIn', 'true');
                localStorage.setItem('email', authData.user.email);
                localStorage.setItem('sessionId', authData.sessionId);
                localStorage.setItem('id_token', authData.user.id_token);
                localStorage.setItem('access_token', authData.user.access_token);
                localStorage.setItem('username', authData.user.username);
    
                setSnackbarOpen(true);
                setSnackbarMessage("Login success");
                setSnackbarVariant("success");
    
                // Navigate to the navbar page
                setTimeout(() => {
                    navigate('/navbar');
                }, 2000);
            } else {
                // If the response is not JSON, treat it as a redirect URL
                const responseText = await response.text();
                console.log("Redirecting to:", responseText);
                window.location.href = responseText;
            }
        } catch (error) {
            console.error("Error signing in with Google:", error.message);
            setSnackbarOpen(true);
            setSnackbarMessage("Error!! Please try again.");
            setSnackbarVariant("error");
        }
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
                <div role="form" onKeyPress={(e) => { if (e.key === 'Enter') handleLogin(e); }}>
                    <form onSubmit={handleLogin}>
                        <div className="card1">
                            <div>
                                <h1 className="gradient-text-login">Ta-HuB</h1>
                            </div>
                            <div className="form-container-login">
                                <label htmlFor="email" className="Email">Email Address</label>
                                <div className="input-container-login">
                                    <TextField
                                        className="input"
                                        id="filled-basic-email"
                                        variant="standard"
                                        type="text"
                                        name="email"
                                        placeholder="Email Address"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                    />
                                </div>

                                <label htmlFor="password" className="Email">Password</label>
                                <div className="input-container-password">
                                    <TextField
                                        className="input"
                                        id="filled-basic-password"
                                        variant="standard"
                                        type="password"
                                        name="password"
                                        placeholder="Password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                    />
                                </div>
                            </div>

                            <Link to="/forget-password" className="login-href">
                                Having trouble signing in?
                            </Link>

                            <div className="checkbox">
                                <input type="checkbox" id="remember-device" name="remember-device" className="checkbox" />
                                <label htmlFor="remember-device">Remember this device</label>
                            </div>

                            <button type="submit" className="button-login">
                                Sign In
                            </button>
                            <div className="or-divider">
                                <div className="divider"></div>
                                <span>Or</span>
                                <div className="divider"></div>
                            </div>
                            <button type="button" onClick={handleGoogleSignIn} className="google-signin-button">
                                <span className="icon"></span>
                                Continue with Google
                            </button>

                            <div className="login-secondary-login">
                                <div className="text-center">
                                    <div className="link-container">
                                        {/* <div className="link">New to TA-HUB?</div>
                                        <span>
                                            <Link to="/register" className="signup">
                                                Sign-up
                                            </Link>
                                        </span> */}
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
    );
}

export default Login;
