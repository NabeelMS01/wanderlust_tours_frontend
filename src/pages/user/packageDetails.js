import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../services/api';
import Button from '../../components/ui/Button';
import API_ENDPOINTS from '../../constants/api.endpoint';
import toast from 'react-hot-toast';
import config from '../../config';

function PackageDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [travelPackage, setTravelPackage] = useState(null);
  const [selectedOptionalServices, setSelectedOptionalServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPackage = async () => {
      try {
        const res = await api.get(`${API_ENDPOINTS.PACKAGES}/${id}`);
        setTravelPackage(res.data);
      } catch (err) {
        setError('Error loading package');
      } finally {
        setLoading(false);
      }
    };
    fetchPackage();
  }, [id]);

  const toggleOptionalService = (serviceId) => {
    setSelectedOptionalServices((prev) =>
      prev.includes(serviceId)
        ? prev.filter((id) => id !== serviceId)
        : [...prev, serviceId]
    );
  };

  const calculateTotal = () => {
    if (!travelPackage) return 0;
    let total = Number(travelPackage.basePrice) || 0;
    travelPackage.optionalServices.forEach((service) => {
      if (selectedOptionalServices.includes(service._id)) {
        total += service.price;
      }
    });
    return total;
  };

  const handleBooking = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      await api.post(`${API_ENDPOINTS.BOOKINGS}/book`, {
        packageId: travelPackage._id,
        selectedServiceIds: selectedOptionalServices,
      });
      navigate('/bookings');
    } catch (err) {
      console.error('Error booking package:', err);
      toast.error('Failed to book package');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Loading package...</p>
      </div>
    );
  }

  if (error || !travelPackage) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-red-500">{error || 'Package not found'}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
 
      <div
        className="h-96 flex items-end justify-center text-white p-8"
        style={{
          backgroundImage: `linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.4)), url(${ config.SERVER_URL+travelPackage.image})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="text-center">
          <h1 className="text-4xl font-bold">{travelPackage.title}</h1>
          <p className="mt-2">{travelPackage.from} ➔ {travelPackage.to}</p>
        </div>
      </div>

      
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 grid grid-cols-1 lg:grid-cols-3 gap-8">
        
      
        <div className="lg:col-span-2 space-y-8">
         
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <h2 className="text-2xl font-bold mb-4">Package Overview</h2>
            <div className="text-gray-600 space-y-2">
              <p><strong>Start Date:</strong> {new Date(travelPackage.startDate).toDateString()}</p>
              <p><strong>End Date:</strong> {new Date(travelPackage.endDate).toDateString()}</p>
              <p><strong>Base Price:</strong> ₹ {travelPackage.basePrice}</p>
            </div>
          </div>

     
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <h2 className="text-2xl font-bold mb-4">Included Services</h2>
            {travelPackage.includedServices.length === 0 ? (
              <p className="text-gray-400">No included services listed.</p>
            ) : (
              <ul className="list-disc list-inside text-gray-700 space-y-1">
                {travelPackage.includedServices.map((service, idx) => (
                  <li key={idx}>{service}</li>
                ))}
              </ul>
            )}
          </div>

        
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <h2 className="text-2xl font-bold mb-4">Optional Services</h2>
            {travelPackage.optionalServices.length === 0 ? (
              <p className="text-gray-400">No optional services available.</p>
            ) : (
              <div className="space-y-4">
                {travelPackage.optionalServices.map((service) => (
                  <div key={service._id} className="flex items-center justify-between border p-3 rounded-md">
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={selectedOptionalServices.includes(service._id)}
                        onChange={() => toggleOptionalService(service._id)}
                        className="h-5 w-5 text-blue-600 focus:ring-blue-500"
                      />
                      <span>{service.name}</span>
                    </div>
                    <span className="text-green-600 font-semibold">₹ {service.price}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

       
        <div className="sticky top-24 space-y-6">
          <div className="bg-white p-6 rounded-xl shadow-md">
            <h3 className="text-xl font-bold mb-4">Booking Summary</h3>

            <div className="space-y-2 text-gray-700">
              <div className="flex justify-between">
                <span>Base Price:</span>
                <span>₹ {travelPackage.basePrice}</span>
              </div>
              <div className="flex justify-between">
                <span>Optional Services:</span>
                <span>₹ {calculateTotal() - travelPackage.basePrice}</span>
              </div>
              <div className="border-t pt-2 flex justify-between font-bold">
                <span>Total:</span>
                <span>₹ {calculateTotal()}</span>
              </div>
            </div>

            <Button onClick={handleBooking} className="w-full mt-6">
              Book Now
            </Button>
          </div>
        </div>

      </div>
    </div>
  );
}

export default PackageDetails;
