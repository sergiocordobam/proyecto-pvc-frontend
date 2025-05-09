import React from 'react';
import RegisterForm from './components/user/RegisterForm';
import Home from './components/base/Home';
import Login from './components/user/Login';
import MyProfile from './components/base/MyProfile';
import { Route, Routes } from 'react-router-dom';
import Dashboard from "./components/documents/Dashboard.jsx";
import Form from "./components/documents/Form.jsx";
import CitizenTransferComponent from "./components/transfer/CitizenTransferComponent.jsx";
function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/register" element={<RegisterForm />} />
      <Route path="/login" element={<Login />} />
      <Route path="/my-profile" element={<MyProfile />} />
      <Route path="/dashboard" element={<Dashboard  />} />
      <Route path="/dashboard/form" element={<Form />} />
      <Route path="/transfer" element={<CitizenTransferComponent />} />
    </Routes>
  );
}

export default App;