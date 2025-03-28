import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, CssBaseline } from '@mui/material';
import theme from './theme';
import Navbar from './components/navbar/Navbar';
import Home from './pages/Home';
import Wards from './pages/Wards';
import Nurses from './pages/Nurses';

const App = () => {
  return (
      <Router>
          <ThemeProvider theme={theme}>
              <CssBaseline />
              <Navbar />
              <div style={{ padding: '20px' }}>
                  <Routes>
                      <Route path="/" element={<Home />} />
                      <Route path="/wards" element={<Wards />} />
                      <Route path="/nurses" element={<Nurses />} />
                  </Routes>
              </div>
          </ThemeProvider>

      </Router>
  );
};

export default App;
