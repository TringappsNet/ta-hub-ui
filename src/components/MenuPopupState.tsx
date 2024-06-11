import React, { useEffect, useState } from 'react';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import PopupState, { bindTrigger, bindMenu } from 'material-ui-popup-state';
import { useNavigate, Link } from "react-router-dom";
import ConfirmDialog from '../Grid/ConfirmationDialog';
import IconButton from '@mui/material/IconButton';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import '../styles/MenuPopupState.css';
import InvitePopup from './InvitePopup'; 

export default function MenuPopupState() {
    const navigate = useNavigate();  
    const [email, setEmail] = useState<string | null>(null);
    const [logoutDialogOpen, setLogoutDialogOpen] = useState(false); 
    const [showInvitePopup, setShowInvitePopup] = useState(false);

    useEffect(() => {
        const storedEmail = localStorage.getItem('email');
        if (storedEmail) {
            setEmail(storedEmail);
        }
    }, []);

    const handleLogoutConfirm = async () => {
        try {
            await fetch("http://localhost:8080/api/logout", {
                method: "POST",
                credentials: 'include'
            });
            localStorage.clear();
            sessionStorage.removeItem('user'); // Clear user session data
            setLogoutDialogOpen(false);
            navigate("/login"); 
        } catch (error) {
            console.error("Error during logout:", error);
        }
    };


    // const handleLogoutConfirm = () => {
    //     localStorage.clear();
    //     setLogoutDialogOpen(false);
    //     navigate("/login"); 
        
    // };
    
    const openInvitePopup = () => {
        setShowInvitePopup(true);
    };

    const closeInvitePopup = () => {
        setShowInvitePopup(false);
    };

    return (
        <PopupState variant="popover" popupId="demo-popup-menu">
            {(popupState) => (
                <React.Fragment>
                    <Button 
                        style={{color:"grey",backgroundColor:"rgb(207, 207, 206)",boxShadow:"none",background:"none",textTransform:"lowercase"}}
                        variant="contained" 
                        {...bindTrigger(popupState)}
                    >
                         {email}
                        <IconButton {...bindTrigger(popupState)}  className='arrow' size="small">
                            <ArrowDropDownIcon />
                        </IconButton>
                    </Button>
                    
                    <Menu {...bindMenu(popupState)} className='dropDown'>
                        <MenuItem component={Link} to="/reset-password">
                            Reset Password
                        </MenuItem>
                        <MenuItem onClick={openInvitePopup}>Send Invite</MenuItem>
                        <MenuItem onClick={() => setLogoutDialogOpen(true)}>Logout</MenuItem>
                    </Menu>
                    <ConfirmDialog 
                        open={logoutDialogOpen} 
                        setOpen={setLogoutDialogOpen} 
                        onConfirm={handleLogoutConfirm}     
                        message="Are you sure you want to logout ?"
                    />
                    <InvitePopup show={showInvitePopup} handleClose={closeInvitePopup} />
                </React.Fragment>
            )}
        </PopupState>
    );
}
