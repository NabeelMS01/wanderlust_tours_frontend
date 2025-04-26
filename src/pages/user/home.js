import { useState, useEffect } from 'react';
import api from '../../services/api';
import { useNavigate } from 'react-router-dom';

function Home() {
  const navigate = useNavigate();
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPackages = async () => {
      try {
        const res = await api.get('/packages/search'); // call search API
        setPackages(res.data);
      } catch (err) {
        console.error('error fetching packages:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchPackages();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">loading packages...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-3xl font-bold text-primary mb-8 text-center">available packages</h1>

      {packages.length === 0 ? (
        <p className="text-center text-gray-500">no packages available</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {packages.map((pkg) => (
            <div
              key={pkg._id}
              className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition cursor-pointer"
              onClick={() => navigate(`/packages/${pkg._id}`)}
            >
              <h2 className="text-xl font-semibold text-primary mb-2">
                {pkg.from} ➔ {pkg.to}
              </h2>
              <p className="text-gray-600 mb-2">start: {new Date(pkg.startDate).toDateString()}</p>
              <p className="text-gray-600 mb-2">end: {new Date(pkg.endDate).toDateString()}</p>
              <p className="text-lg font-bold text-green-600">₹ {pkg.basePrice}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Home;
