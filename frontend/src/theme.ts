import { createTheme } from '@mui/material/styles';

// Application theme
const theme = createTheme({
    palette: {
        primary: {
            main: '#1976d2', // primary blue color
            contrastText: 'white'
        },
        secondary: {
            main: '#9c27b0', // secondary purple color
        },
    }
});

export default theme;
