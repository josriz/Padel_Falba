import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import PrenotaCampi from './pages/PrenotaCampi';
import EventiTornei from './pages/EventiTornei';
import Marketplace from './pages/Marketplace';
import Profilo from './pages/Profilo';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/prenota-campi" element={<PrenotaCampi />} />
      <Route path="/eventi-tornei" element={<EventiTornei />} />
      <Route path="/marketplace" element={<Marketplace />} />
      <Route path="/profilo" element={<Profilo />} />
    </Routes>
  );
}
