import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Login from "./components/Login";
import Register from "./components/Register";
import Candidates from "./components/Candidates";
import Home from "./components/Home";
import Profile from "./components/Profile";
import Vote from "./components/Vote";
import ChangePassword from "./components/Changepassword";

export default function App() {
  return (
    <div className="bg-gray-900 min-h-screen">
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/candidates" element={<Candidates />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/vote" element={<Vote />} />
          <Route path="/changepassword" element={<ChangePassword />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}
