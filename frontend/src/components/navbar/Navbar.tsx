import React from 'react';
import { AppBar, Toolbar, Typography, Button } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { NavLink } from 'react-router-dom';

// Common style for all buttons in the Navbar
const navButtonStyle = {
    borderRadius: '20px',
    '&.active': {
        backgroundColor: 'white',
        color: 'primary.main',
        fontWeight: 'bold',
        borderRadius: '20px',
    },
};


const Navbar = () => {
    const theme = useTheme();
    return (
        <AppBar position="sticky">
            <Toolbar>
                <Typography variant="h6" sx={{ flexGrow: 1 }}>
                    Hospital App
                </Typography>
                <Button
                    color="inherit"
                    component={NavLink}
                    to="/"
                    sx = {navButtonStyle}
                >
                    Home
                </Button>
                <Button
                    color="inherit"
                    component={NavLink}
                    to="/wards"
                    sx = {navButtonStyle}
                >
                    Wards
                </Button>
                <Button
                    color="inherit"
                    component={NavLink}
                    to="/nurses"
                    sx = {navButtonStyle}
                >
                    Nurses
                </Button>
            </Toolbar>
        </AppBar>
    );
};

export default Navbar;
