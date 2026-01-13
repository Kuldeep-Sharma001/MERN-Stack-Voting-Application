import { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";

const Navbar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setIsLoggedIn(!!localStorage.getItem("login"));
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    setIsLoggedIn(false);
    navigate("/login");
  };

  const linkClasses = ({ isActive }) =>
    `hover:bg-violet-500 hover:text-white h-15 pt-5 px-2 lg:px-6 md:px-4 rounded-xl ${
      isActive ? "bg-violet-500 text-white" : ""
    }`;

  return (
    <nav className="flex justify-between py-1 px-2 sm:px-10 bg-violet-900 h-16 items-center">
      <NavLink to="/" className="text-white font-bold text-3xl">
        Voting App
      </NavLink>

      {isLoggedIn ? (
        <div className="flex gap-5 text-xl text-gray-300 font-semibold items-center">
          <NavLink to="/profile" className={linkClasses}>
            Profile
          </NavLink>
          <NavLink to="/vote" className={linkClasses}>
            Vote
          </NavLink>
          <button
            onClick={handleLogout}
            className="hover:bg-violet-500 hover:text-white h-15 px-2 lg:px-6 md:px-4 rounded-xl cursor-pointer"
          >
            Logout
          </button>
        </div>
      ) : (
        <div className="flex gap-1 text-xl text-gray-300 font-semibold">
          <NavLink to="/candidates" className={linkClasses}>
            Candidates
          </NavLink>
          <NavLink to="/login" className={linkClasses}>
            Login
          </NavLink>
          <NavLink to="/register" className={linkClasses}>
            Register
          </NavLink>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
