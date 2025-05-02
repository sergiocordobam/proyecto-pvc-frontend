import React from 'react';
import RegisterForm from './components/user/RegisterForm';
import Home from './components/base/Home';
import { Route, Routes } from 'react-router-dom';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/register" element={<RegisterForm />} />
    </Routes>
  );
}

export default App;