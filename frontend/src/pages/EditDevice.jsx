import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import Select from 'react-select';
import { toast } from 'react-toastify';
import { category } from '../assets/assets';

const EditDevice = () => {
  const { backendUrl } = useContext(AppContext);
  const { id } = useParams();
  const navigate = useNavigate();

  const [manufacturers, setManufacturers] = useState([]);
  const [distributorss, setDistributors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [categories, setCategories] = useState(category);
  const [isDisabled, setIsDisabled] = useState(false);


  const [deviceForm, setDeviceForm] = useState({
    name: '',
    model: '',
    price: '',
    price_p: '',
    description: '',
    category: '',
    subcategory: '',
    manufacturer: '',
    register: false,
    distributors: [],
    image: '',
  });

  const distributorOption = distributorss.map((item) => ({
    value: item._id,
    label: item.name,
  }));

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [mRes, sRes, dRes] = await Promise.all([
          axios.get(`${backendUrl}/api/manufacturer`),
          axios.get(`${backendUrl}/api/distributor`),
          axios.get(`${backendUrl}/api/device/${id}`),
        ]);
        // const res = await axios.get(`${backendUrl}/api/distributor`);
        // const result = res.data
        setManufacturers(mRes.data.manufacturers || []);
        setDistributors(sRes.data.distributors || []);





        if (dRes.data.success) {
          const d = dRes.data.device;
          setDeviceForm({
            name: d.name || '',
            model: d.model || '',
            price: d.price || '',
            price_p: d.price_p || '',
            description: d.description || '',
            category: d.category || '',
            subcategory: d.subcategory || '',
            register: d.register || '',
            manufacturer: d.manufacturer?._id || '',
            distributors: d.distributors
              ? d.distributors.map((des) => ({ value: des._id, label: des.name }))
              : [],
            image: d.image || '',
          });
        }
      } catch (err) {
        console.error(err);
        setError('Failed to load data');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [backendUrl, id]);

  const handleInputChange = (field, value) => {
    setDeviceForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleFileChange = (e) => {
    setImageFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    setIsDisabled(true)
    e.preventDefault();

    if (!deviceForm.name || !deviceForm.model) {
      toast.error('Please fill all required fields');
      return;
    }

    const formData = new FormData();
    formData.append('name', deviceForm.name);
    formData.append('model', deviceForm.model);
    formData.append('price', deviceForm.price);
    formData.append('price_p', deviceForm.price_p);
    formData.append('description', deviceForm.description);
    formData.append('category', deviceForm.category);
    formData.append('subcategory', deviceForm.subcategory);
    formData.append('manufacturer', deviceForm.manufacturer);
    formData.append('register', deviceForm.register);
    formData.append(
      'distributors',
      JSON.stringify(deviceForm.distributors.map((s) => s.value))
    );
    if (imageFile) formData.append('image', imageFile);

    try {
      const response = await axios.put(
        `${backendUrl}/api/device/update/${id}`,
        formData,
        { headers: { 'Content-Type': 'multipart/form-data' } }
      );

      if (response.data.success) {
        toast.success('Device updated successfully!');
        navigate('/device');
      } else {
        toast.error('Error updating device');
      }
    } catch (err) {
      console.error(err);
      toast.error('Error updating device');
    } finally {
      setIsDisabled(false)
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <p className="text-gray-500 text-lg">Loading device...</p>
      </div>
    );
  }




  return (
    <div className="mt-30 w-[90%] sm:w-[80%] mx-auto">
      <form
        onSubmit={handleSubmit}
        className="flex flex-col md:flex-row gap-x-10 gap-y-6 p-6 bg-gray-100 rounded-xl shadow-sm border border-gray-200"
      >
        {/* صورة الجهاز */}
        <div className="flex flex-col items-center justify-start md:w-64">
          <label htmlFor="device-image" className="cursor-pointer group">
            <div className="w-48 h-48 border-2 border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center bg-white hover:bg-gray-50 transition-colors">
              {imageFile ? (
                <img
                  src={URL.createObjectURL(imageFile)}
                  alt="preview"
                  className="w-full h-full object-cover rounded-xl"
                />
              ) : (
                <img
                  src={deviceForm.image || 'https://cdn-icons-png.flaticon.com/512/1048/1048953.png'}
                  alt="Device"
                  className="w-full h-full object-cover rounded-xl"
                />
              )}
            </div>
            <input
              id="device-image"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
            />
          </label>
          <p className="mt-2 text-xs text-gray-500 text-center">
            JPG, PNG or GIF (max. 5MB)
          </p>
        </div>

        {/* Left Side: Form Fields */}
        <div className="flex-1 space-y-6">
          {/* Device Name */}
          <div>
            <label className="block text-gray-800 text-sm font-medium mb-1">
              Device Name
            </label>
            <input
              type="text"
              value={deviceForm.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              placeholder="Enter device name"
              className="w-full px-4 py-3 bg-white text-gray-900 placeholder-gray-500 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent transition"
            />
          </div>

          {/* Model & Price */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-800 text-sm font-medium mb-1">
                Device Model
              </label>
              <input
                type="text"
                value={deviceForm.model}
                onChange={(e) => handleInputChange('model', e.target.value)}
                placeholder="Enter device model"
                className="w-full px-4 py-3 bg-white text-gray-900 placeholder-gray-500 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent transition"
              />
            </div>

            {/* price & B2B price */}
            <div className='flex flex-col md:flex-row gap-2'>
              <div className='w-full md:w-1/2'>
                <label className="block text-gray-800 text-sm font-medium mb-1">
                  Price
                </label>
                <input
                  type="number"
                  value={deviceForm.price}
                  onChange={(e) => handleInputChange('price', e.target.value)}
                  placeholder="12000"
                  className="w-full px-4 py-3 bg-white text-gray-900 placeholder-gray-500 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent transition"
                />
              </div>

              <div className='w-full md:w-1/2'>
                <label className="block text-gray-800 text-sm font-medium mb-1">
                  B2B Price:
                </label>
                <input
                  type="number"
                  value={deviceForm.price_p}
                  onChange={(e) => handleInputChange('price_p', e.target.value)}
                  placeholder="12000"
                  className="w-full px-4 py-3 bg-white text-gray-900 placeholder-gray-500 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent transition"
                />
              </div>
            </div>
          </div>



          {/* Category & Subcategory */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Category */}
            <div>
              <label className="block text-gray-800 text-sm font-medium mb-1">
                Category
              </label>
              <Select
                options={categories.map(cat => ({
                  value: cat.name,
                  label: cat.name,
                }))}
                value={
                  deviceForm.category
                    ? { value: deviceForm.category, label: deviceForm.category }
                    : null
                }
                onChange={(selected) => {
                  handleInputChange('category', selected ? selected.value : '');
                  handleInputChange('subcategory', ''); // reset subcategory when category changes
                }}
                placeholder="Select category..."
                className="react-select-container"
                classNamePrefix="react-select"
              />
            </div>

            {/* Subcategory */}
            <div>
              <label className="block text-gray-800 text-sm font-medium mb-1">
                Sub-Category
              </label>
              <Select
                options={
                  categories
                    .find(cat => cat.name === deviceForm.category)
                    ?.subcategories.map(sub => ({ value: sub, label: sub })) || []
                }
                value={
                  deviceForm.subcategory
                    ? { value: deviceForm.subcategory, label: deviceForm.subcategory }
                    : null
                }
                onChange={(selected) =>
                  handleInputChange('subcategory', selected ? selected.value : '')
                }
                placeholder={
                  deviceForm.category ? 'Select sub-category...' : 'Select category first'
                }
                isDisabled={!deviceForm.category}
                className="react-select-container"
                classNamePrefix="react-select"
              />
            </div>
          </div>


          {/* Manufacturer & Supplier */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-800 text-sm font-medium mb-1">Manufacturer</label>
              <select
                required
                value={deviceForm.manufacturer}
                onChange={(e) => handleInputChange('manufacturer', e.target.value)}
                className="w-full px-4 py-3 bg-white text-gray-900 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent appearance-none transition"
              >
                <option value="" disabled>Select manufacturer</option>
                {manufacturers.map((item) => (
                  <option key={item._id} value={item._id}>
                    {item.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-gray-800 text-sm font-medium mb-2">Distributor(s)</label>
              {loading ? (
                <div className="p-2 text-gray-500 text-sm">Loading distributor...</div>
              ) : error ? (
                <div className="p-2 text-red-500 text-sm">{error}</div>
              ) : (
                <Select
                  isMulti
                  options={distributorOption}
                  value={deviceForm.distributors}
                  onChange={(selected) => handleInputChange('distributors', selected)}
                  placeholder="Select distributors..."
                  className="basic-multi-select"
                  classNamePrefix="select"
                />
              )}
            </div>
          </div>
          {/* If Device Registerd ? */}
          <div className="flex items-start gap-2">
            <input
              type="checkbox"
              id="has-agent"
              checked={deviceForm.register}
              onChange={(e) => handleInputChange('register', e.target.checked)}
              className="w-4 h-4 text-black bg-white border-gray-300 rounded focus:ring-black focus:ring-2"
            />
            <label htmlFor="has-agent" className="text-gray-800 text-sm font-medium">
              SDFA  Registerd ?
            </label>
          </div>

          {/* Description */}
          <div>
            <label className="block text-gray-800 text-sm font-medium mb-1">
              Description
            </label>
            <textarea
              value={deviceForm.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder="Enter device description..."
              rows="4"
              className="w-full px-4 py-3 bg-white text-gray-900 placeholder-gray-500 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent resize-none transition"
            />
          </div>

          {/* Submit Button */}
          <div className="mt-4 flex gap-4">
            <button
              type="submit"
              className={`flex-1 px-6 py-3 b text-white font-medium rounded-lg ${isDisabled ? "bg-gray-400 cursor-not-allowed" : "bg-black hover:bg-gray-800"} focus:outline-none focus:ring-2 focus:ring-gray-700 focus:ring-offset-2 focus:ring-offset-gray-100 transition shadow-md`}
            >
              Update Device
            </button>

            <button
              type="button"
              className="flex-1 px-6 py-3 bg-red-600 text-white font-medium rounded-lg hover:bg-red-500 transition shadow-md"
              onClick={async () => {
                if (window.confirm('Are you sure you want to delete this device?')) {
                  try {
                    const res = await axios.delete(`${backendUrl}/api/device/remove/${id}`);
                    if (res.data.success) {
                      toast.success('Device deleted!');
                      navigate('/device');
                    } else {
                      toast.error('Failed to delete device');
                    }
                  } catch (err) {
                    console.error(err);
                    toast.error('Error deleting device');
                  }
                }
              }}
            >
              Delete Device
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default EditDevice;
