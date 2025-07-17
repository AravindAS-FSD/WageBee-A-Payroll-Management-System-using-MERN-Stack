import React from 'react';
import { Routes, Route } from 'react-router-dom';

import Welcome from '../pages/Welcome';
import Login from '../pages/Login';

const PublicRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Welcome />} />
      <Route path="/login" element={<Login />} />
    </Routes>
  );
};

export default PublicRoutes;
