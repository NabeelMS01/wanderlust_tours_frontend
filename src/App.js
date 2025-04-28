import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/common/Navbar";
import Login from "./pages/auth/login";
import Signup from "./pages/auth/signup";
import Home from "./pages/user/home";
import Bookings from "./pages/user/booking/bookings";
import PackageDetails from "./pages/user/packageDetails";
import PrivateRoute from "./components/common/PrivateRoute";
import AdminDashboard from './pages/admin/AdminDashboard';
import BookingDetails from "./pages/user/booking/bookingDetail";

function App() {
  return (
    <Router>
      <Navbar />
      <div className="mt-1">
        <Routes> 
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/packages/:id" element={<PackageDetails />} />

        
          <Route
            path="/bookings"
            element={
              <PrivateRoute>
                <Bookings />
              </PrivateRoute>
            }
          />
            {/* <Route
            path="/bookings/:id"
            element={
              <PrivateRoute>
                <BookingDetails />
              </PrivateRoute>
            }
          /> */}
          <Route
            path="/admin"
            element={
              <PrivateRoute>
                <AdminDashboard />
              </PrivateRoute>
            }
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
