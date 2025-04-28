import { useState, useEffect } from 'react';
import api from '../../../services/api';
import API_ENDPOINTS from '../../../constants/api.endpoint';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import config from '../../../config';

function Bookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('upcoming');
  const navigate = useNavigate();

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const res = await api.get(API_ENDPOINTS.BOOKINGS);
      setBookings(res.data);
    } catch (err) {
      console.error('error fetching bookings:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleConfirm = async (id) => {
    try {
      await api.patch(`${API_ENDPOINTS.BOOKINGS}/${id}/confirm`);
      toast.success('Booking confirmed!');
      fetchBookings();
    } catch (err) {
      console.error('error confirming booking:', err);
      toast.error('Failed to confirm booking');
    }
  };

  const handleCancel = async (id) => {
    try {
      await api.patch(`${API_ENDPOINTS.BOOKINGS}/${id}/cancel`);
      toast.success('Booking cancelled');
      fetchBookings();
    } catch (err) {
      console.error('error cancelling booking:', err);
      toast.error('Failed to cancel booking');
    }
  };

  const filteredBookings = bookings.filter((b) => {
    if (activeTab === 'upcoming') return b.status === 'pending' || b.status === 'confirmed';
    if (activeTab === 'completed') return b.status === 'completed';
    if (activeTab === 'cancelled') return b.status === 'cancelled';
    return true;
  });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Loading bookings...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">My Bookings</h1>
            <p className="mt-2 text-gray-600">View and manage your trips</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            {['upcoming', 'cancelled'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)} Trips
              </button>
            ))}
          </nav>
        </div>

        {/* Bookings List */}
        <div className="space-y-6 mt-8">
          {filteredBookings.length === 0 ? (
            <div className="text-center py-12">
              <i className="fas fa-suitcase-rolling text-5xl text-gray-300 mb-4"></i>
              <h3 className="text-xl font-medium text-gray-700 mb-2">No bookings found</h3>
              <p className="text-gray-500 mb-6">You don't have any bookings in this category yet.</p>
            </div>
          ) : (
            filteredBookings.map((booking) => (
              <div
                key={booking._id}
                className="booking-card bg-white rounded-xl shadow-sm p-6 transition duration-300 relative"
              >
                <div
                  className={`status-badge text-white text-xs font-bold px-2 py-1 rounded-full absolute top-2 right-2 ${
                    booking.status === 'confirmed'
                      ? 'bg-green-500'
                      : booking.status === 'pending'
                      ? 'bg-yellow-500'
                      : 'bg-red-500'
                  }`}
                >
                  {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                </div>

                <div className="flex flex-col md:flex-row">
                  <div className="md:w-1/4 mb-4 md:mb-0">
                    {booking.package?.image ? (
                      <img
                        src={config.SERVER_URL+booking.package.image}
                        alt={booking.package.title}
                        className="w-full h-48 object-cover rounded-lg"
                      />
                    ) : (
                      <div className="w-full h-48 bg-gray-200 rounded-lg flex items-center justify-center text-gray-400">
                        No Image
                      </div>
                    )}
                  </div>

                  <div className="md:w-2/4 md:px-6">
                    <h3 className="text-xl font-bold mb-2">
                      {booking.package?.from} ➔ {booking.package?.to}
                    </h3>
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div>
                        <p className="text-sm text-gray-500">Departure</p>
                        <p className="font-medium">{new Date(booking.package?.startDate).toDateString()}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">End</p>
                        <p className="font-medium">{new Date(booking.package?.endDate).toDateString()}</p>
                      </div>
                    </div>
                  </div>

                  <div className="md:w-1/4 mt-4 md:mt-3 border-t md:border-t-0 md:border-l pt-4 md:pt-0 md:pl-6">
                    <div className="flex justify-between mb-4">
                      <p className="text-gray-600">Total to be paid</p>
                      <p className="font-bold">₹{booking.totalPrice}</p>
                    </div>
                    <div className="flex flex-col space-y-2">
                      {/* <button
                        onClick={() => navigate(`/bookings/${booking.package?._id}`)}
                        className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition duration-300 text-sm"
                      >
                        View Details
                      </button> */}
                      {booking.status === 'pending' && (
                        <>
                          <button
                            onClick={() => handleConfirm(booking._id)}
                            className="w-full bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600 transition duration-300 text-sm"
                          >
                            Confirm Booking
                          </button>
                          <button
                            onClick={() => handleCancel(booking._id)}
                            className="w-full bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600 transition duration-300 text-sm"
                          >
                            Cancel Booking
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default Bookings;
