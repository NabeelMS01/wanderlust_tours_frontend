import { useState, useEffect } from "react";
import api from "../../services/api";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import Modal from "../../components/ui/Modal";
import toast from "react-hot-toast";
import Loading from "../../components/common/Loading";

function AdminDashboard() {
  const [packages, setPackages] = useState([]);
  const [formData, setFormData] = useState({
    title: "",
    from: "",
    to: "",
    startDate: "",
    endDate: "",
    basePrice: "",
    includedServices: [],
    optionalServices: [],
  });
  const [includedServiceName, setIncludedServiceName] = useState("");
  const [optionalServiceName, setOptionalServiceName] = useState("");
  const [optionalServicePrice, setOptionalServicePrice] = useState("");
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchPackages();
  }, []);

  const fetchPackages = async () => {
    try {
      setLoading(true);
      const res = await api.get("/admin/package");
      setPackages(res.data);
    } catch (err) {
      toast.error("Error fetching packages");
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePackage = async (e) => {
    e.preventDefault();
    try {
      const payload = { ...formData };
      if (payload.optionalServices.length === 0) {
        delete payload.optionalServices;
      }
      await api.post("/admin/package", payload);
      toast.success("Package created");
      resetForm();
      setIsModalOpen(false);
      fetchPackages();
    } catch (err) {
      toast.error("Error creating package");
    }
  };

  const resetForm = () => {
    setFormData({
      title: "",
      from: "",
      to: "",
      startDate: "",
      endDate: "",
      basePrice: "",
      includedServices: [],
      optionalServices: [],
    });
    setIncludedServiceName("");
    setOptionalServiceName("");
    setOptionalServicePrice("");
  };

  const handleAddIncludedService = () => {
    if (!includedServiceName.trim()) return;
    setFormData((prev) => ({
      ...prev,
      includedServices: [...prev.includedServices, includedServiceName.trim()],
    }));
    setIncludedServiceName("");
  };

  const handleRemoveIncludedService = (index) => {
    setFormData((prev) => ({
      ...prev,
      includedServices: prev.includedServices.filter((_, i) => i !== index),
    }));
  };

  const handleAddOptionalService = () => {
    if (!optionalServiceName.trim()) return;
    setFormData((prev) => ({
      ...prev,
      optionalServices: [
        ...prev.optionalServices,
        {
          name: optionalServiceName.trim(),
          price: optionalServicePrice ? Number(optionalServicePrice) : 0,
        },
      ],
    }));
    setOptionalServiceName("");
    setOptionalServicePrice("");
  };

  const handleRemoveOptionalService = (index) => {
    setFormData((prev) => ({
      ...prev,
      optionalServices: prev.optionalServices.filter((_, i) => i !== index),
    }));
  };

  const handleDeletePackage = async (id) => {
    if (!window.confirm("Are you sure you want to delete this package?")) return;
    try {
      await api.delete(`/admin/package/${id}`);
      toast.success("Package deleted");
      fetchPackages();
    } catch (err) {
      toast.error("Error deleting package");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6 md:p-10">
      <h1 className="text-3xl font-bold text-primary text-center mb-10">
        Admin Dashboard
      </h1>

      <div className="flex justify-end mb-8">
        <Button onClick={() => setIsModalOpen(true)} className="px-5">
          Create Package
        </Button>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <div className="p-4 md:p-8 max-w-2xl mx-auto">
          <h2 className="text-3xl font-bold mb-8 text-primary text-center">
            Create New Package
          </h2>

          <form onSubmit={handleCreatePackage} className="space-y-8">
            <Input
              label="Title"
              placeholder="Enter package title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input label="From" placeholder="Origin" value={formData.from} onChange={(e) => setFormData({ ...formData, from: e.target.value })} required />
              <Input label="To" placeholder="Destination" value={formData.to} onChange={(e) => setFormData({ ...formData, to: e.target.value })} required />
              <Input label="Start Date" type="date" value={formData.startDate} onChange={(e) => setFormData({ ...formData, startDate: e.target.value })} required />
              <Input label="End Date" type="date" value={formData.endDate} onChange={(e) => setFormData({ ...formData, endDate: e.target.value })} required />
              <Input label="Base Price" type="number" placeholder="In INR" value={formData.basePrice} onChange={(e) => setFormData({ ...formData, basePrice: e.target.value })} required />
            </div>

            {/* Included Services */}
            <div>
              <h3 className="text-xl font-bold text-primary mb-4">Included Services (No Extra Charges)</h3>
              <div className="flex flex-col md:flex-row gap-2 mb-4">
                <Input label="Service Name" placeholder="Eg: Free Breakfast" value={includedServiceName} onChange={(e) => setIncludedServiceName(e.target.value)} />
                <Button type="button" onClick={handleAddIncludedService} className="w-full md:w-auto">Add</Button>
              </div>
              <div className="space-y-1">
                {formData.includedServices.length === 0 ? (
                  <p className="text-gray-400 text-sm">No included services added</p>
                ) : (
                  formData.includedServices.map((service, index) => (
                    <div key={index} className="flex justify-between items-center text-gray-700">
                      <span>• {service}</span>
                      <button type="button" onClick={() => handleRemoveIncludedService(index)} className="text-red-500 text-xs hover:text-red-700">Remove</button>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Optional Services */}
            <div>
              <h3 className="text-xl font-bold text-primary mb-4">Optional Services (Extra Charges)</h3>
              <div className="flex flex-col md:flex-row gap-2 mb-4">
                <Input label="Service Name" placeholder="Eg: City Tour" value={optionalServiceName} onChange={(e) => setOptionalServiceName(e.target.value)} />
                <Input label="Service Price" placeholder="Eg: 500" type="number" value={optionalServicePrice} onChange={(e) => setOptionalServicePrice(e.target.value)} />
                <Button type="button" onClick={handleAddOptionalService} className="w-full md:w-auto">Add</Button>
              </div>
              <div className="space-y-1">
                {formData.optionalServices.length === 0 ? (
                  <p className="text-gray-400 text-sm">No optional services added</p>
                ) : (
                  formData.optionalServices.map((service, index) => (
                    <div key={index} className="flex justify-between items-center text-gray-700">
                      <span>• {service.name} - ₹{service.price}</span>
                      <button type="button" onClick={() => handleRemoveOptionalService(index)} className="text-red-500 text-xs hover:text-red-700">Remove</button>
                    </div>
                  ))
                )}
              </div>
            </div>

            <Button type="submit" className="w-full mt-6">Create Package</Button>
          </form>
        </div>
      </Modal>

      {/* Packages Listing */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <Loading />
        ) : packages.length === 0 ? (
          <p className="text-gray-500 text-center col-span-3">No packages created yet</p>
        ) : (
          packages.map((pkg) => (
            <div key={pkg._id} className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition relative">
              <h3 className="text-xl font-bold text-primary mb-2">{pkg.title}</h3>
              <p className="text-gray-600 text-sm">{pkg.from} ➔ {pkg.to}</p>
              <p className="text-gray-600 text-sm">Start: {new Date(pkg.startDate).toDateString()}</p>
              <p className="text-gray-600 text-sm">End: {new Date(pkg.endDate).toDateString()}</p>
              <p className="text-green-600 font-bold text-lg mt-2">₹ {pkg.basePrice}</p>
              <button onClick={() => handleDeletePackage(pkg._id)} className="absolute top-2 right-2 text-red-500 hover:text-red-700 text-xs">
                Delete
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default AdminDashboard;
