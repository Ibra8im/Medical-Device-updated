import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react';
import { AppContext } from '../context/AppContext';
import Select from 'react-select';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { assets, category } from '../assets/assets';

const AddDevice = () => {
  const { backendUrl, setManufacturerLength, setDistributorLength } = useContext(AppContext);
  const navigate = useNavigate()
  const [categories, setCategories] = useState(category)
  const [manufacturers, setManufacturers] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [imageFile, setImageFile] = useState(null); // ⬅️ لتخزين الصورة
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
  });

  // تحويل الموردين إلى react-select
  const supplierOptions = suppliers.map((item) => ({
    value: item._id,
    label: item.name,
  }));

  const fetchManufacturers = async () => {
    try {
      const response = await axios.get(`${backendUrl}/api/manufacturer`);
      setManufacturers(response.data.manufacturers || []);
      setManufacturerLength(response.data.manufacturers || []);
    } catch (err) {
      console.error('Error fetching manufacturers:', err);
      setError('Failed to load manufacturers');
    }
  };

  const fetchSuppliers = async () => {
    try {
      const response = await axios.get(`${backendUrl}/api/distributor`);
      setSuppliers(response.data.distributors || []);
      setDistributorLength(response.data.distributors || []);
    } catch (err) {
      console.error('Error fetching suppliers:', err);
      setError('Failed to load suppliers');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchManufacturers();
    fetchSuppliers();
  }, [backendUrl]);



  const handleInputChange = (field, value) => {
    setDeviceForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleFileChange = (e) => {
    setImageFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsDisabled(true)

    if (!deviceForm.name || !deviceForm.model) {
      toast.error('Please fill all required fields');
      return;
    }

    const deviceData = {

      price: deviceForm.price ? parseFloat(deviceForm.price) : undefined,
      price_p: deviceForm.price_p ? parseFloat(deviceForm.price_p) : undefined,
      distributors: deviceForm.supplier ? deviceForm.supplier.map(option => option.value) : [],
    };

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
    formData.append('distributors', JSON.stringify(deviceForm.supplier.map((s) => s.value)));
    if (imageFile) formData.append('image', imageFile); // ⬅️ إضافة الصورة

    try {
      const response = await axios.post(`${backendUrl}/api/device/add`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      if (response.data.success) {
        toast.success('Device added successfully!');
        setDeviceForm({
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
        });
        setImageFile(null);
        navigate('/device');
      } else {
        toast.error('Error adding device');
      }
    } catch (error) {
      console.error('Error adding device:', error);
      toast.error('Error adding device');
    } finally {
      setIsDisabled(false)
    }
  };

  return (
    <div className="mt-30 w-[90%] sm:w-[80%] mx-auto">
      <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-x-10 gap-y-6 p-6 bg-gray-100 rounded-xl shadow-sm border border-gray-200">
        {/* صورة المنتج */}
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
                <>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-10 w-10 text-gray-400 group-hover:text-gray-500 transition-colors"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                  <p className="mt-2 text-sm text-gray-500 group-hover:text-gray-600 transition-colors">
                    Click to upload
                  </p>
                </>
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
            <label className="block text-gray-800 text-sm font-medium mb-1">Device Name</label>
            <input
              required
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
              <label className="block text-gray-800 text-sm font-medium mb-1">Device Model</label>
              <input
                required
                type="text"
                value={deviceForm.model}
                onChange={(e) => handleInputChange('model', e.target.value)}
                placeholder="Enter device model"
                className="w-full px-4 py-3 bg-white text-gray-900 placeholder-gray-500 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent transition"
              />
            </div>

            {/* price & Price_p */}
            <div className=' flex flex-col md:flex-row gap-2 '>
              {/* Price */}
              <div className='w-full md:w-1/2 ' >
                <label className="block text-gray-800 text-sm font-medium mb-1">Price</label>
                <input
                  type="number"
                  value={deviceForm.price}
                  onChange={(e) => handleInputChange('price', e.target.value)}
                  placeholder="12000"
                  className="w-full px-4 py-3 bg-white text-gray-900 placeholder-gray-500 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent transition"
                />
              </div>
              {/* price_p */}
              <div className='w-full md:w-1/2 '>
                <label className="block text-gray-800 text-sm font-medium mb-1">Price B2B</label>
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
            {/* قائمة الفئات */}
            <div>
              <label className="block text-gray-800 text-sm font-medium mb-1">
                Category
              </label>
              <select
                value={deviceForm.category}
                onChange={(e) => handleInputChange("category", e.target.value)}
                className="w-full px-4 py-3 bg-white text-gray-900 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent appearance-none transition"
              >
                <option value="">Select category</option>
                {categories.map((cat, index) => (
                  <option key={index} value={cat.name}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            {/* قائمة الفئات الفرعية */}
            <div>
              <label className="block text-gray-800 text-sm font-medium mb-1">
                Sub-Category
              </label>
              <select
                value={deviceForm.subcategory}
                onChange={(e) => handleInputChange("subcategory", e.target.value)}
                className="w-full px-4 py-3 bg-white text-gray-900 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent appearance-none transition"
                disabled={!deviceForm.category}
              >
                <option value="">Select sub-category</option>
                {categories
                  .find((cat) => cat.name === deviceForm.category)
                  ?.subcategories.map((sub, index) => (
                    <option key={index} value={sub}>
                      {sub}
                    </option>
                  ))}
              </select>
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
                  options={supplierOptions}
                  value={deviceForm.supplier}
                  onChange={(selected) => handleInputChange('supplier', selected)}
                  placeholder="Select suppliers..."
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
            <label className="block text-gray-800 text-sm font-medium mb-1">Description</label>
            <textarea
              value={deviceForm.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder="Enter device description..."
              rows="4"
              className="w-full px-4 py-3 bg-white text-gray-900 placeholder-gray-500 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent resize-none transition"
            />
          </div>


          {/* Submit Button */}
          <div className="mt-4">
            <button
              type="submit"
              className={`w-full px-6 py-3 bg-black text-white font-medium rounded-lg hover:bg-gray-800 focus:outline-none focus:ring-2
               focus:ring-gray-700 focus:ring-offset-2 focus:ring-offset-gray-100 transition shadow-md ${isDisabled ? "bg-gray-400 cursor-not-allowed" : "bg-black hover:bg-gray-800"}`}
            >
              Add Device
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default AddDevice;