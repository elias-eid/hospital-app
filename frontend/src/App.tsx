import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, CssBaseline } from '@mui/material';
import theme from './theme';
import Navbar from './components/navbar/Navbar';
import Home from './pages/Home';
import Wards from './pages/Wards';
import Nurses from './pages/Nurses';
import { Box } from '@mui/material';

const App = () => {
  return (
      <Router>
          <ThemeProvider theme={theme}>
              <CssBaseline />
              <Navbar />
              <Box sx={{
                  maxWidth: '1800px', // You can adjust the max width according to your design
                  margin: '0 auto',   // This will center the content horizontally
                  padding: '0 16px',  // Add horizontal padding on smaller screens (adjust as needed)
              }}>
                  <div style={{ padding: '20px' }}>
                      <Routes>
                          <Route path="/" element={<Home />} />
                          <Route path="/wards" element={<Wards />} />
                          <Route path="/nurses" element={<Nurses />} />
                      </Routes>
                  </div>
              </Box>
          </ThemeProvider>

      </Router>
  );
};

export default App;
