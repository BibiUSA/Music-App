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
import Settings from "./pages/SettingsPage/SettingsPage";
import FriendPage from "./pages/FriendPage/FriendPage";
import Message from "./pages/Messages/Messages";
import { useLocation } from "react-router-dom";
import { environment } from "./environment";

function App() {
  const fullData = Data.data;
  const location = useLocation();

  {
    environment.development && console.log(import.meta.env);
  }

  return (
    <div className="app">
      <Provider>
        {location.pathname !== "/login" && (
          <div className="nav">
            <Navbar />
          </div>
        )}
        <Routes>
          <Route index path="/" element={<Home />} />
          <Route path="/messages" element={<Message />} />
          <Route path="/account" element={<Account />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/login" element={<LogIn />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/friend/:friend" element={<FriendPage />} />
        </Routes>
      </Provider>
    </div>
  );
}

export default App;
