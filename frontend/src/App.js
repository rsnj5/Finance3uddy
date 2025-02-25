import React from 'react';
import { Routes, Route } from 'react-router-dom';
import LandingPage from './pages/home';
import Login from './pages/login.js';
import Signup from './pages/signup.js';

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      
    </Routes>
  );
};

export default App;
