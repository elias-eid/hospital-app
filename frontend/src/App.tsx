import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, CssBaseline } from '@mui/material';
import theme from './theme';
import Navbar from './components/navbar/Navbar';
import Home from './pages/Home';
import Wards from './pages/Wards';
import Nurses from './pages/Nurses';
import { Box } from '@mui/material';
import { WardsProvider } from './contexts/WardsContext';
import { NursesProvider } from './contexts/NursesContext';

const App = () => {
    return (
        <Router>
            <ThemeProvider theme={theme}>
                <CssBaseline />
                <WardsProvider>
                    <NursesProvider>
                        <Navbar />
                        <Box sx={{
                            maxWidth: '1800px', // limiting the maxWidth to avoid excessively large tables on ultra-wide displays
                            margin: '0 auto',
                            padding: '0 16px',
                        }}>
                            <div style={{ padding: '20px' }}>
                                <Routes>
                                    <Route path="/" element={<Home />} />
                                    <Route path="/wards" element={<Wards />} />
                                    <Route path="/nurses" element={<Nurses />} />
                                </Routes>
                            </div>
                        </Box>
                    </NursesProvider>
                </WardsProvider>
            </ThemeProvider>
        </Router>
    );
};

export default App;