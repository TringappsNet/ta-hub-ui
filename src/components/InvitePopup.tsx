import React, { useState, useEffect } from 'react';
import { Modal, Button, TextField, Box, IconButton, Select, MenuItem } from '@mui/material';
import { Clear } from '@mui/icons-material'; // Import the Clear icon for close symbol

const InvitePopup = ({ show, handleClose }) => {
  const [email, setEmail] = useState('');
  const [roles, setRoles] = useState([]);
  const [selectedRole, setSelectedRole] = useState('');

  useEffect(() => {
    // Fetch roles from API when component mounts
    fetchRoles();
  }, []);

  const fetchRoles = async () => {
    try {
      const response = await fetch('http://localhost:8090/api/roles/');
      const data = await response.json();
      setRoles(data); 
    } catch (error) {
      console.error('Error fetching roles:', error);
    }
  };

  const handleSendInvite = async () => {
    try {
      // Find the role ID corresponding to the selected role name
      const selectedRoleId = roles.find(role => role.role === selectedRole)?.roleId;

      if (!selectedRoleId) {
        console.error('Selected role not found.');
        return;
      }

      // Send invite with email and role ID
      const response = await fetch('http://localhost:8090/api/auth/send-invite', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, roleId: selectedRoleId }), // Send roleId instead of role
      });

      if (response.ok) {
        console.log('Invite sent successfully.');
      } else {
        console.error('Failed to send invite:', response.statusText);
      }
    } catch (error) {
      console.error('Error sending invite:', error);
    }

    // Close the popup after sending the invite
    handleClose();
  };

  return (
    <Modal open={show} onClose={handleClose} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Box sx={{ bgcolor: 'background.paper', width: '50%', p: 4, position: 'relative',borderRadius:2}}>
        {/* Close symbol */}
        <IconButton
          aria-label="close"
          onClick={handleClose}
          sx={{ position: 'absolute', top: 5, right: 5 ,margin:1}}
        >
          <Clear />
        </IconButton>

        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center',margin:3 }}>
          <TextField
            label="Email"
            variant="outlined"
            fullWidth
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          {roles.length > 0 && (
            <Select
              labelId="role-label"
              id="role"
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
              sx={{ width: '200px' }}
              displayEmpty
            >
              <MenuItem value="">
                <em>Select Role</em>
              </MenuItem>
              {roles.map((role) => (
                <MenuItem key={role.roleId} value={role.role}>
                  {role.role}
                </MenuItem>
              ))}
            </Select>
          )}
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
       
          <Button variant="contained" onClick={handleSendInvite} sx={{ ml: 2 }}>
            Send Invite
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default InvitePopup;
