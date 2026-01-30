import { useDispatch, useSelector } from "react-redux";
import { NavLink, useNavigate } from "react-router-dom";
import { setLogin, setUser, setToken } from '../app/slice/user'; // Ensure these are exported from slice

const Navbar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isLogin, user } = useSelector(state => state.user);
  const isAdmin = user?.role === 'admin';

  const handleLogout = () => {
    localStorage.clear();
    dispatch(setLogin()); 
    dispatch(setUser(null));
    dispatch(setToken(null));
    navigate("/login");
  };

  const navLinkClass = ({ isActive }) =>
    `px-4 py-2 rounded-lg transition-all duration-300 font-medium ${
      isActive 
        ? "bg-violet-600 text-white shadow-lg shadow-violet-500/30" 
        : "text-gray-300 hover:text-white hover:bg-white/10"
    }`;

  return (
    <nav className="sticky top-0 z-50 backdrop-blur-md bg-black/30 border-b border-white/10 h-16 flex items-center justify-between px-4 lg:px-10 shadow-sm">
      <NavLink to="/" className="text-2xl font-bold bg-linear-to-r from-violet-400 to-fuchsia-400 bg-clip-text text-transparent hover:opacity-80 transition-opacity">
        KS VOTING APP
      </NavLink>

      <div className="flex items-center gap-2 md:gap-4">
      <NavLink to="/candidates" className={navLinkClass}>Candidates</NavLink>
        {isLogin ? (
          <>
            {isAdmin ? (
              <>
                <NavLink to="/voter-list" className={navLinkClass}>Voters</NavLink>
              </>
            ) : (
              <NavLink to="/vote" className={navLinkClass}>Vote</NavLink>
            )}
            <NavLink to="/profile" className={navLinkClass}>Profile</NavLink>
            <button
              onClick={handleLogout}
              className="px-4 py-2 rounded-lg bg-red-500/20 text-red-300 hover:bg-red-500 hover:text-white transition-all duration-300 ml-2"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <NavLink to="/login" className={navLinkClass}>Login</NavLink>
            <NavLink to="/register" className={navLinkClass}>Register</NavLink>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;