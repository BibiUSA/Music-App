import { useState, useEffect } from "react";
import Data from "./Data";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
import Home from "./pages/Home/Home";
import Navbar from "./components/Navbar";
import Account from "./pages/Account/Account";
import Profile from "./pages/Profile/Profile";
import "bootstrap/dist/css/bootstrap.min.css";
import LogIn from "./pages/LogIn/LogIn";
import Provider from "./contexts/auth/provider";
import Settings from "./pages/Settings/Settings";

function App() {
  const fullData = Data.data;

  return (
    <div>
      <BrowserRouter>
        <Provider>
          <Navbar />
          <Routes>
            <Route index path="/" element={<Home />} />
            <Route path="/account" element={<Account />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/login" element={<LogIn />} />
            <Route path="/settings" element={<Settings />} />
          </Routes>
        </Provider>
      </BrowserRouter>
    </div>
  );
}

export default App;
