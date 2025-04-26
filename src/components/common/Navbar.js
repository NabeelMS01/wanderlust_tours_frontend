import { Link, useNavigate } from 'react-router-dom';

function Navbar() {
  const navigate = useNavigate();
  const isLoggedIn = !!localStorage.getItem('token');

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <nav className="bg-white shadow-md p-4 flex justify-between items-center">
      <div>
        <Link to="/" className="text-primary font-bold text-2xl">
          wanderlust
        </Link>
      </div>

      <div className="flex space-x-6">
        {isLoggedIn ? (
          <>
            <Link to="/" className="text-gray-700 hover:text-primary">
              home
            </Link>
            <Link to="/bookings" className="text-gray-700 hover:text-primary">
              my bookings
            </Link>
            <button
              onClick={handleLogout}
              className="text-red-500 hover:text-red-700 transition duration-150"
            >
              logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="text-gray-700 hover:text-primary">
              login
            </Link>
            <Link to="/signup" className="text-gray-700 hover:text-primary">
              signup
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
