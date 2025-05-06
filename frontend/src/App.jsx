import React from 'react';
import RegisterForm from './components/user/RegisterForm';
import Home from './components/base/Home';
import Login from './components/user/Login';
import MyProfile from './components/base/MyProfile';
import { Route, Routes } from 'react-router-dom';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/register" element={<RegisterForm />} />
      <Route path="/login" element={<Login />} />
      <Route path="/my-profile" element={<MyProfile />} />
    </Routes>
  );
}

export default App;