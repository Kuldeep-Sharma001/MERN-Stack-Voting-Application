import { BrowserRouter, Routes, Route, Navigate, Outlet } from "react-router-dom";
import Navbar from "./components/Navbar";
import Login from "./components/Login";
import Register from "./components/Register";
import Candidates from "./components/Candidates";
import Home from "./components/Home";
import Profile from "./components/Profile";
import Vote from "./components/Vote";
import ChangePassword from "./components/Changepassword";
import AddCandidate from "./components/AddCandidate";
import VoterList from "./components/VoterList";
import { Toaster } from 'react-hot-toast';
import { useSelector } from 'react-redux';

// Route Protection
const ProtectedRoute = ({ isAllowed, redirectPath = '/login', children }) => {
  if (!isAllowed) {
    return <Navigate to={redirectPath} replace />;
  }
  return children ? children : <Outlet />;
};

export default function App() {
  const { isLogin, user } = useSelector(state => state.user);
  const isAdmin = user?.role === 'admin';

  return (
    <div className="bg-linear-to-br from-gray-900 via-purple-950 to-slate-900 min-h-screen text-white font-sans selection:bg-violet-500 selection:text-white">
      <Toaster position="top-center" toastOptions={{
        style: { background: '#333', color: '#fff' }
      }}/>
      <BrowserRouter>
        <Navbar />
        <div className="p-4">
          <Routes>
            <Route path="/" element={<Home />} />
            
            {/* Public/Auth Routes */}
            <Route path="/login" element={isLogin ? <Navigate to="/profile" /> : <Login />} />
            <Route path="/register" element={isLogin && !isAdmin ? <Navigate to="/profile" /> : <Register />} />
              <Route path="/candidates" element={<Candidates />} />
            
            {/* Protected Routes (Voters & Admins) */}
            <Route element={<ProtectedRoute isAllowed={isLogin} />}>
              <Route path="/profile" element={<Profile />} />
              <Route path="/changepassword" element={<ChangePassword />} />
              
              {/* Only Voters can vote */}
              <Route path="/vote" element={!isAdmin ? <Vote /> : <Navigate to="/candidates" />} />
            </Route>

            {/* Admin Only Routes */}
            <Route element={<ProtectedRoute isAllowed={isLogin && isAdmin} redirectPath="/" />}>
              <Route path="/voter-list" element={<VoterList />} />
              <Route path="/add-candidate" element={<AddCandidate />} />
            </Route>
          </Routes>
        </div>
      </BrowserRouter>
    </div>
  );
}