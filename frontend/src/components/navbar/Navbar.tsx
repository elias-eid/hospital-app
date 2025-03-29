import React from 'react';
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { useTheme, Theme} from '@mui/material/styles';
import { NavLink } from 'react-router-dom';

// Common style for all buttons in the Navbar
const navButtonStyle = (theme: Theme) => ({
    borderRadius: '20px',
    '&.active': {
        backgroundColor: theme.palette.primary.contrastText, // Uses theme-defined colors
        color: theme.palette.primary.main,
        fontWeight: 'bold',
    },
});

const Navbar = () => {
    const theme = useTheme();
    return (
        <AppBar position="sticky">
            <Toolbar>
                <Box sx={{ width: '100%', maxWidth: '1800px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', paddingX: 2 }}>
                    <Typography variant="h6">
                        Hospital App
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 2 }}>
                        <Button
                            color="inherit"
                            component={NavLink}
                            to="/"
                            sx={navButtonStyle(theme)}
                        >
                            Home
                        </Button>
                        <Button
                            color="inherit"
                            component={NavLink}
                            to="/wards"
                            sx={navButtonStyle(theme)}
                        >
                            Wards
                        </Button>
                        <Button
                            color="inherit"
                            component={NavLink}
                            to="/nurses"
                            sx={navButtonStyle(theme)}
                        >
                            Nurses
                        </Button>
                    </Box>
                </Box>
            </Toolbar>
        </AppBar>
    );
};

export default Navbar;
