import React, { useState } from 'react';
import { TextField } from "@mui/material";
import { useNavigate } from "react-router-dom";
import '../styles/register.css';
import CustomSnackbar from "./CustomSnackbar";
import { useLocation } from 'react-router-dom';
import { useSearchParams } from 'react-router-dom';

function Register() {
    const [formData, setFormData] = useState({
        username: "",
        phoneNo: "",
        // email: "",
        password: "",
        confirmPassword: ""
    });
    const navigate = useNavigate();
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState("");
    const [snackbarVariant, setSnackbarVariant] = useState('success');

    const location = useLocation();
    const [searchParams] = useSearchParams();

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
      

        if (!formData.username ||!formData.phoneNo ||!formData.password ||!formData.confirmPassword) {
            setSnackbarOpen(true);
            setSnackbarMessage("Please fill all fields!");
            setSnackbarVariant("error");
            return;
        }

        if (formData.password!== formData.confirmPassword) {
            setSnackbarOpen(true);
            setSnackbarMessage("Passwords do not match!");
            setSnackbarVariant("error");
            return;
        }

        // const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        // if (!emailRegex.test(formData.email)) {
        //     setSnackbarOpen(true);
        //     setSnackbarMessage("Please enter a valid email!");
        //     setSnackbarVariant("error");
        //     return;
        // }

        try {
            const inviteToken = searchParams.get('token');

            const payload = {
                username: formData.username,
                phone: formData.phoneNo,
                password: formData.confirmPassword
            };

              // email: formData.email,
              // confirmPassword: formData.confirmPassword

            const response = await fetch(`http://localhost:8080/api/auth/register?inviteToken=${inviteToken }`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(payload)
            });
            const message=await response.text();


            if (!response.ok) {
                throw new Error(message);
            }

            setSnackbarOpen(true);
            setSnackbarMessage(message);
            setSnackbarVariant("success");
            setTimeout(() => {
                navigate('/login');
            }, 2000);
            setFormData({
                username: "",
                phoneNo: "",
                // email: "",
                password: "",
                confirmPassword: ""
            });

        } catch (error) {
            console.error("Registration error:", error);
            setSnackbarOpen(true);
            setSnackbarMessage(error.message);
            setSnackbarVariant("error");
        }
    };

    const handleCloseSnackbar = () => {
        setSnackbarOpen(false);
        setSnackbarMessage("");
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
                <div role="form" onKeyPress={(e) => { if (e.key === 'Enter') e.preventDefault(); }}>
                    <form onSubmit={handleSubmit}>
                        <div className="card1">
                            <div>
                                <h1 className="gradient-text-sign">Sign up</h1>
                            </div>
                            <div className="form-container-register">
                                <label htmlFor="username" className="label-reg">User Name</label>
                                <div className="input-container-register">
                                    <TextField 
                                        className="input" 
                                        id="filled-basic-user" 
                                        variant="standard"
                                        type="text"
                                        name="username"
                                        placeholder="User name" 
                                        onChange={handleInputChange}
                                    />
                                </div>
                                <label htmlFor="phoneNo" className="label-reg">Phone No</label>
                                <div className="input-container-register">
                                    <TextField 
                                        className="input" 
                                        id="filled-basic-mobile" 
                                        variant="standard"
                                        type="text"
                                        name="phoneNo"
                                        onChange={handleInputChange}
                                        placeholder="Phone No" 
                                    />
                                </div>
                                {/* <label htmlFor="email" className="Email">Email Address</label>
                                <div className="input-container-register">
                                    <TextField 
                                        className="input" 
                                        id="filled-basic-email" 
                                        variant="standard"
                                        type="text"
                                        name="email"
                                        placeholder="Email Address" 
                                        onChange={handleInputChange}
                                    />
                                </div> */}
                                <label htmlFor="password" className="label-reg">New Password</label>
                                <div className="input-container-register">
                                    <TextField 
                                        className="input" 
                                        id="filled-basic-password" 
                                        variant="standard"
                                        type="password"
                                        name="password"
                                        onChange={handleInputChange}
                                        placeholder="New Password" 
                                    />
                                </div>
                                <label htmlFor="confirmPassword" className="label-reg">Confirm Password</label>
                                <div className="input-container-register">
                                    <TextField 
                                        className="input" 
                                        id="filled-basic-conpassword" 
                                        variant="standard"
                                        type="password"
                                        name="confirmPassword"
                                        placeholder="Confirm Password" 
                                        onChange={handleInputChange}
                                    />
                                </div>
                            </div>
                            <button type="submit" className="button-register">
                                Submit
                            </button>
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

export default Register;
