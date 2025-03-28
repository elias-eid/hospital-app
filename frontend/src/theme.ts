import { createTheme } from '@mui/material/styles';

// Application theme
const theme = createTheme({
    palette: {
        primary: {
            main: '#1976d2', // primary blue color
        },
        secondary: {
            main: '#9c27b0', // secondary purple color
        },
    },
    typography: {
        // Define any typography customizations here
    },
    components: {
        MuiCssBaseline: {
            styleOverrides: {
                ':root': {
                    '--primary-color': '#1976d2', // Use primary color in CSS variables
                },
            },
        },
    },
});

export default theme;
