import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import config from "../../config";
import Input from "../../components/ui/Input";

function Home() {
  const navigate = useNavigate();
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(false);

  const [filters, setFilters] = useState({
    from: "",
    to: "",
    startDate: "",
    endDate: "",
  });

  useEffect(() => {
    fetchAllPackages(); // 👈 Fetch all packages when page loads
  }, []);

  const fetchAllPackages = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/packages/search`); // No query params → all packages
      setPackages(res.data);
    } catch (err) {
      console.error("Error fetching packages:", err);
      setPackages([]);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setFilters((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filters.from) params.append("from", filters.from);
      if (filters.to) params.append("to", filters.to);
      if (filters.startDate) params.append("startDate", filters.startDate);
      if (filters.endDate) params.append("endDate", filters.endDate);

      const res = await api.get(`/packages/search?${params.toString()}`);
      setPackages(res.data);
    } catch (err) {
      console.error("Error searching packages:", err);
      setPackages([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
    
      <section
        className="hero-bg h-[80vh] flex items-center justify-center text-white bg-cover bg-center"
        style={{
          backgroundImage: `linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.4)), url('https://images.unsplash.com/photo-1506929562872-bb421503ef21?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80')`,
        }}
      >
        <div className="text-center px-6">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Find Your Next Trip
          </h1>
          <p className="text-lg md:text-xl mb-6">
            Search and book amazing travel packages
          </p>
        </div>
      </section>

    
      <section className="bg-white py-8">
        <div className="max-w-5xl mx-auto px-6">
          <form
            onSubmit={handleSearch}
            className="grid grid-cols-1 md:grid-cols-4 gap-4"
          >
            <Input
              type="text"
              name="from"
              placeholder="From"
              value={filters.from}
              onChange={handleInputChange}
            />
            <Input
              type="text"
              name="to"
              placeholder="To"
              value={filters.to}
              onChange={handleInputChange}
            />
            <Input
              type="date"
              name="startDate"
              value={filters.startDate}
              onChange={handleInputChange}
            />
            <Input
              type="date"
              name="endDate"
              value={filters.endDate}
              onChange={handleInputChange}
            />

            <button
              type="submit"
              className="col-span-1 md:col-span-4 bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition"
            >
              {loading ? "Searching..." : "Search Packages"}
            </button>
          </form>
        </div>
      </section>
 
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-6">
          {loading ? (
            <p className="text-center text-gray-500">Loading packages...</p>
          ) : packages.length === 0 ? (
            <p className="text-center text-gray-500">
              No packages found. Try different search filters.
            </p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {packages.map((pkg) => (
                <div
                  key={pkg._id}
                  className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition transform hover:-translate-y-1 cursor-pointer"
                  onClick={() => navigate(`/packages/${pkg._id}`)}
                >
                  <div className="h-48 bg-gray-200">
                    <img
                      src={`${config.SERVER_URL}${pkg.image}`}
                      alt={pkg.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                      {pkg.title}
                    </h3>
                    <p className="text-gray-600 mb-1">
                      {pkg.from} ➔ {pkg.to}
                    </p>
                    <p className="text-gray-600 text-sm mb-2">
                      {new Date(pkg.startDate).toLocaleDateString()} -{" "}
                      {new Date(pkg.endDate).toLocaleDateString()}
                    </p>
                    <p className="text-green-600 font-bold text-lg">
                      ₹ {pkg.basePrice}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

export default Home;
