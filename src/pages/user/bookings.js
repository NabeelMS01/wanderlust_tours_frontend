import { useState, useEffect } from 'react';
import api from '../../services/api';
// import { useNavigate } from 'react-router-dom';

function Bookings() { 
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const res = await api.get('/bookings');
        setBookings(res.data);
      } catch (err) {
        console.error('error fetching bookings:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchBookings();
  }, []);

  const handleConfirm = async (id) => {
    try {
      await api.patch(`/bookings/${id}/confirm`);
      window.location.reload(); // refresh after confirm
    } catch (err) {
      console.error('error confirming booking:', err);
    }
  };

  const handleCancel = async (id) => {
    try {
      await api.patch(`/bookings/${id}/cancel`);
      window.location.reload(); // refresh after cancel
    } catch (err) {
      console.error('error cancelling booking:', err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">loading bookings...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-3xl font-bold text-primary mb-8 text-center">my bookings</h1>

      {bookings.length === 0 ? (
        <p className="text-center text-gray-500">no bookings found</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {bookings.map((booking) => (
            <div key={booking._id} className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition">
              <h2 className="text-xl font-semibold text-primary mb-2">
                {booking.package?.from} ➔ {booking.package?.to}
              </h2>
              <p className="text-gray-600 mb-1">start: {new Date(booking.package?.startDate).toDateString()}</p>
              <p className="text-gray-600 mb-1">end: {new Date(booking.package?.endDate).toDateString()}</p>
              <p className="text-gray-600 mb-2">status: <span className={`font-semibold ${booking.status === 'pending' ? 'text-yellow-500' : booking.status === 'accepted' ? 'text-green-600' : 'text-red-500'}`}>{booking.status}</span></p>
              <p className="text-lg font-bold text-green-600 mb-4">₹ {booking.totalPrice}</p>

              {booking.status === 'pending' && (
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleConfirm(booking._id)}
                    className="flex-1 bg-green-500 text-white py-2 rounded-md hover:bg-green-600 transition duration-200"
                  >
                    confirm
                  </button>
                  <button
                    onClick={() => handleCancel(booking._id)}
                    className="flex-1 bg-red-500 text-white py-2 rounded-md hover:bg-red-600 transition duration-200"
                  >
                    cancel
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Bookings;
