import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Register from "./pages/Register";
import BloodRequest from "./pages/BloodRequest";
import Donate from "./pages/Donate";
import Pending from "./pages/Pending";

function App() {
  return (
    <>
      <Router>
        <Header />
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/blood-request" element={<BloodRequest />} />
          <Route path="/donate" element={<Donate />} />
          <Route path="/pending" element={<Pending />} />
        </Routes>
        <ToastContainer />
      </Router>
    </>
  );
}

export default App;
