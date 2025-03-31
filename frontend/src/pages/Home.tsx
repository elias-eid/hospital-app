/**
 * Home Page Component
 *
 * Displays a simple welcome message on the home page of the application.
 *
 * @component
 * @returns {JSX.Element} Home page with a welcome message
 */

import React from 'react';
import { Typography } from '@mui/material';

const Home = () => {
    return (
        <div>
            <Typography variant="h4" gutterBottom>
                Welcome to the Hospital App!
            </Typography>
        </div>
    );
};

export default Home;
