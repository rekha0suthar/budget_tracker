import logo from '../assets/logo.png';
import { FiLogOut } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
  const { token, loading, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  if (loading) return null; //  wait until token is initialized

  return (
    <div className="navbar">
      <div className="navbar-left">
        <img src={logo} alt="FinScope Logo" className="logo" />
        <span className="app-name">FinScope</span>
      </div>

      {token && (
        <button className="logout-btn" onClick={handleLogout} title="Logout">
          <FiLogOut size={22} />
        </button>
      )}
    </div>
  );
};

export default Navbar;
