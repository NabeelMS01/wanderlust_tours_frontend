  import { useState, useEffect } from "react";
  import api from "../../services/api";
  import Input from "../../components/ui/Input";
  import Button from "../../components/ui/Button";
  import Modal from "../../components/ui/Modal";
  import toast from "react-hot-toast";
  import Loading from "../../components/common/Loading";
  import API_ENDPOINTS from "../../constants/api.endpoint";
import config from "../../config";

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
    const [imageFile, setImageFile] = useState(null);
    const [includedServiceName, setIncludedServiceName] = useState("");
    const [optionalServiceName, setOptionalServiceName] = useState("");
    const [optionalServicePrice, setOptionalServicePrice] = useState("");
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingPackage, setEditingPackage] = useState(null);

    useEffect(() => {
      fetchPackages();
    }, []);

    const fetchPackages = async () => {
      try {
        setLoading(true);
        const res = await api.get(API_ENDPOINTS.ADMIN_PACKAGES);
        setPackages(res.data);
      } catch (err) {
        toast.error("Error fetching packages");
      } finally {
        setLoading(false);
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
      setImageFile(null);
      setEditingPackage(null);
    };

const handleSubmitPackage = async (e) => {
  e.preventDefault();
  try {
    const form = new FormData();
    form.append("title", formData.title);
    form.append("from", formData.from);
    form.append("to", formData.to);
    form.append("startDate", formData.startDate);
    form.append("endDate", formData.endDate);
    form.append("basePrice", formData.basePrice);

    formData.includedServices.forEach((service, idx) => {
      form.append(`includedServices[${idx}]`, service);
    });

    formData.optionalServices.forEach((service, idx) => {
      form.append(`optionalServices[${idx}][name]`, service.name);
      form.append(`optionalServices[${idx}][price]`, service.price);
    });

    if (imageFile) {
      form.append("image", imageFile);
    } else if (editingPackage?.image) {
      form.append("existingImage", editingPackage.image); 
    }

    if (editingPackage) {
      // ✅ Edit mode (PUT with FormData)
      await api.put(`${API_ENDPOINTS.ADMIN_PACKAGES}/${editingPackage._id}`, form, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      toast.success("Package updated");
    } else {
      // ✅ Create mode (POST with FormData)
      await api.post(API_ENDPOINTS.ADMIN_PACKAGES, form, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      toast.success("Package created");
    }

    resetForm();
    setIsModalOpen(false);
    fetchPackages();
  } catch (err) {
    console.error(err);
    toast.error("Something went wrong");
  }
};


    const openEditModal = (pkg) => {
      setEditingPackage(pkg);
      setFormData({
        title: pkg.title,
        from: pkg.from,
        to: pkg.to,
        startDate: pkg.startDate?.split("T")[0],
        endDate: pkg.endDate?.split("T")[0],
        basePrice: pkg.basePrice,
        includedServices: pkg.includedServices || [],
        optionalServices: pkg.optionalServices || [],
      });
      setImageFile(null);
      setIsModalOpen(true);
    };

    const handleDeletePackage = async (id) => {
      if (!window.confirm("Are you sure you want to delete this package?")) return;
      try {
        await api.delete(`${API_ENDPOINTS.ADMIN_PACKAGES}/${id}`);
        toast.success("Package deleted");
        fetchPackages();
      } catch (err) {
        toast.error("Error deleting package");
      }
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
          { name: optionalServiceName.trim(), price: optionalServicePrice ? Number(optionalServicePrice) : 0 },
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

    const handleImageChange = (e) => {
      const file = e.target.files[0];
      if (file) {
        setImageFile(file);
      }
    };

    return (
      <div className="min-h-screen bg-gray-100 p-6 md:p-10">
        <h1 className="text-3xl font-bold text-primary text-center mb-10">Admin Dashboard</h1>

        <div className="flex justify-end mb-8">
          <Button onClick={() => { resetForm(); setIsModalOpen(true); }} className="px-5">
            Create Package
          </Button>
        </div>

        {/* Modal */}
        <Modal isOpen={isModalOpen} onClose={() => { setIsModalOpen(false); resetForm(); }}>
          <div className="p-4 md:p-8 max-w-2xl mx-auto">
            <h2 className="text-3xl font-bold mb-8 text-primary text-center">
              {editingPackage ? "Edit Package" : "Create New Package"}
            </h2>

            <form onSubmit={handleSubmitPackage} className="space-y-8">
              <Input label="Title" placeholder="eg: Kerala Summer Trip" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} required />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input label="From" value={formData.from} onChange={(e) => setFormData({ ...formData, from: e.target.value })} required />
                <Input label="To" value={formData.to} onChange={(e) => setFormData({ ...formData, to: e.target.value })} required />
                <Input label="Start Date" type="date" value={formData.startDate} onChange={(e) => setFormData({ ...formData, startDate: e.target.value })} required />
                <Input label="End Date" type="date" value={formData.endDate} onChange={(e) => setFormData({ ...formData, endDate: e.target.value })} required />
                <Input label="Base Price" type="number" value={formData.basePrice} onChange={(e) => setFormData({ ...formData, basePrice: e.target.value })} required />
              </div>

              {/* File Upload */}
              <Input label="Package Image" type="file" onChange={handleImageChange} />

              {/* Included Services */}
              <div>
                <h3 className="text-xl font-bold text-primary mb-4">Included Services (No Extra Charges)</h3>
                <div className="flex flex-col md:flex-row gap-2 mb-4">
                  <Input label="Service Name" value={includedServiceName} onChange={(e) => setIncludedServiceName(e.target.value)} />
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
                  <Input label="Service Name" value={optionalServiceName} onChange={(e) => setOptionalServiceName(e.target.value)} />
                  <Input label="Service Price" type="number" value={optionalServicePrice} onChange={(e) => setOptionalServicePrice(e.target.value)} />
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

              <Button type="submit" className="w-full mt-6">{editingPackage ? "Update Package" : "Create Package"}</Button>
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
                {pkg.image && (
                  <img src={`${config.SERVER_URL}`+pkg.image} alt={pkg.title} className="h-40 w-full object-cover rounded-md mb-4" />
                )}
                <h3 className="text-xl font-bold text-primary mb-2">{pkg.title}</h3>
                <p className="text-gray-600 text-sm">{pkg.from} ➔ {pkg.to}</p>
                <p className="text-green-600 font-bold text-lg mt-2">₹ {pkg.basePrice}</p>
                <div className="absolute top-2 right-2 flex gap-2">
                  <button onClick={() => openEditModal(pkg)} className="text-blue-500 hover:text-blue-700 text-xs">Edit</button>
                  <button onClick={() => handleDeletePackage(pkg._id)} className="text-red-500 hover:text-red-700 text-xs">Delete</button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    );
  }

  export default AdminDashboard;
