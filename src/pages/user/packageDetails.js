import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../services/api';
import Button from '../../components/ui/Button';

function PackageDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [travelPackage, setTravelPackage] = useState(null);
  const [selectedServices, setSelectedServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPackage = async () => {
      try {
        const res = await api.get(`/packages/${id}`);
        setTravelPackage(res.data);
      } catch (err) {
        setError('error loading package');
      } finally {
        setLoading(false);
      }
    };
    fetchPackage();
  }, [id]);

  const toggleService = (serviceId) => {
    if (selectedServices.includes(serviceId)) {
      setSelectedServices(selectedServices.filter((id) => id !== serviceId));
    } else {
      setSelectedServices([...selectedServices, serviceId]);
    }
  };

  const calculateTotal = () => {
    if (!travelPackage) return 0;
    let total = travelPackage.basePrice;
    travelPackage.includedServices.forEach((service) => {
      if (selectedServices.includes(service._id)) {
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
 

      await api.post('/bookings', {
        packageId: travelPackage._id,
        selectedServiceIds: selectedServices,
      });
      navigate('/bookings');
    } catch (err) {
      console.error('error booking package:', err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">loading package...</p>
      </div>
    );
  }

  if (error || !travelPackage) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-red-500">{error || 'package not found'}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-3xl mx-auto bg-white p-6 rounded-xl shadow-md">
        <h1 className="text-3xl font-bold text-primary mb-4">
          {travelPackage.from} ➔ {travelPackage.to}
        </h1>
        <p className="text-gray-600 mb-2">start: {new Date(travelPackage.startDate).toDateString()}</p>
        <p className="text-gray-600 mb-2">end: {new Date(travelPackage.endDate).toDateString()}</p>

        <h2 className="text-2xl font-semibold text-primary mt-6 mb-2">Optional services</h2>
        <div className="space-y-3">
          {travelPackage.includedServices.map((service) => (
            <div key={service._id} className="flex items-center justify-between border p-3 rounded-md">
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={selectedServices.includes(service._id)}
                  onChange={() => toggleService(service._id)}
                  className="h-5 w-5 text-primary focus:ring-primary"
                />
                <span className="text-gray-700">{service.name}</span>
              </div>
              <span className="text-green-600 font-semibold">₹ {service.price}</span>
            </div>
          ))}
        </div>

        <div className="mt-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-2">total price</h3>
          <p className="text-2xl text-green-600 font-bold mb-4">₹ {calculateTotal()}</p>

          <Button onClick={handleBooking}>book now</Button>
        </div>
      </div>
    </div>
  );
}

export default PackageDetails;
