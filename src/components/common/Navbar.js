import { Link, useNavigate } from 'react-router-dom';
const jwtDecode = require( 'jwt-decode');  


function Navbar() {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  let role = null;

  if (token) {
    try {
      const decoded = jwtDecode.jwtDecode(token);


      console.log(decoded,'=====');
      
      role = decoded.role;  
    } catch (error) {
      console.error('Error decoding token:', error);
    }
  }

  const isLoggedIn = !!token;
  const isAdmin = role === 'admin';

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
              Home
            </Link>
            <Link to="/bookings" className="text-gray-700 hover:text-primary">
              My Bookings
            </Link>

            {isAdmin && (
              <Link to="/admin" className="text-gray-700 hover:text-primary">
                Admin Panel
              </Link>
            )}

            <button
              onClick={handleLogout}
              className="text-red-500 hover:text-red-700 transition duration-150"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="text-gray-700 hover:text-primary">
              Login
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
