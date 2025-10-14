import React, { useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import { toast, Bounce } from 'react-toastify';

const AddManufacturer = () => {
  const { backendUrl } = useContext(AppContext);
  const { id } = useParams(); // id للتعديل
  const navigate = useNavigate();
  const [imageFile, setImageFile] = useState(null); // ⬅️ لتخزين الصورة
  const [loading, setLoading] = useState(false);
  const [isDisabled, setIsDisabled] = useState(false);
  const [manufacturer, setManufacturer] = useState({
    name: '',
    country: '',
    contact_name: '',
    position: '',
    email: '',
    mobile: '',
    telephone: '',

    website: '',
    address: '',
    distributors: [],
    description: '',
    has_agent: false,
  });

  // جلب بيانات المصنع عند وجود id (تعديل)
  useEffect(() => {
    if (id) {
      setLoading(true);
      axios
        .get(`${backendUrl}/api/manufacturer/${id}`)
        .then((res) => {
          if (res.data.success) {
            const data = res.data.manufacturere || {};
            setManufacturer({
              name: data.name || '',
              country: data.country || '',
              has_agent: data.has_agent || false,
              agent: data.agent || '',
              description: data.description || '',
              contact_name: data.contact_name || '',
              position: data.position || '',
              email: data.email || '',
              website: data.website || '',
              telephone: data.telephone || '',
              mobile: data.mobile || '',


            });
          } else {
            toast.error('Manufacturer not found');
          }
        })
        .catch((err) => toast.error(err.message))
        .finally(() => setLoading(false));
    }
  }, [id, backendUrl]);

  // ✅ أضف الصورة بنفس اسم الحقل في multer
  if (imageFile) {
    formData.append('image', imageFile);
  }

  // حفظ أو تعديل المصنع
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsDisabled(true)
    try {
      let response;
      if (id) {
        // تعديل
        response = await axios.put(`${backendUrl}/api/manufacturer/${id}`, manufacturer);
      } else {
        // إضافة جديد
        response = await axios.post(`${backendUrl}/api/manufacturer/add`, manufacturer);
      }

      if (response.data.success) {
        toast.success(id ? 'Manufacturer Updated Successfully' : 'Manufacturer Added Successfully');
        if (!id) setManufacturer({ name: '', country: '', has_agent: false, agent: '', description: '' });
        navigate('/manufacturer'); // العودة لصفحة المصنعين بعد التعديل أو الإضافة
      } else {
        toast.error('Operation failed');
      }
    } catch (err) {
      toast.error(err.message);
    } finally {
      setIsDisabled(false)
    }
  };

  if (loading) return <p className="text-center mt-10">Loading...</p>;

  return (
    <div className="mt-30 w-[90%] sm:w-[80%] mx-auto">
      <form
        onSubmit={handleSubmit}
        className="p-6 bg-gray-100 rounded-xl shadow-sm border border-gray-200 space-y-6"
      >
        {/* Image & Manufacturer and Country */}
        <div className='flex flex-col md:flex-row gap-4'>
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
          {/*Manufacturer Name & Country  */}
          <div className='w-full'>
            {/* Manufacturer Name */}
            <div>
              <label htmlFor="name" className="block text-gray-800 text-sm font-medium mb-1">
                Manufacturer Name
              </label>
              <input
                type="text"
                id="name"
                value={manufacturer.name}
                onChange={(e) => setManufacturer({ ...manufacturer, name: e.target.value })}
                placeholder="Enter manufacturer name"
                className="w-full px-4 py-3 bg-white text-gray-900 placeholder-gray-500 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent transition"
                required
              />
            </div>

            {/* Country */}
            <div>
              <label htmlFor="country" className="block text-gray-800 text-sm font-medium mb-1">
                Country
              </label>
              <input
                type="text"
                id="country"
                value={manufacturer.country}
                onChange={(e) => setManufacturer({ ...manufacturer, country: e.target.value })}
                placeholder="Enter country"
                className="w-full px-4 py-3 bg-white text-gray-900 placeholder-gray-500 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent transition"
              />
            </div>
          </div>
        </div>
        <hr />
        {/* Contact information */}
        <div>
          Contact Information
        </div>

        {/* Has Agent? */}
        <div className="flex items-start gap-2">
          <input
            type="checkbox"
            id="has-agent"
            checked={manufacturer.has_agent}
            onChange={(e) => setManufacturer({ ...manufacturer, has_agent: e.target.checked })}
            className="w-4 h-4 text-black bg-white border-gray-300 rounded focus:ring-black focus:ring-2"
          />
          <label htmlFor="has-agent" className="text-gray-800 text-sm font-medium">
            Has an agent?
          </label>
        </div>

        {/* Agent Name */}
        {manufacturer.has_agent && (
          <div>
            <label htmlFor="agent" className="block text-gray-800 text-sm font-medium mb-1">
              Agent Name
            </label>
            <input
              type="text"
              id="agent"
              value={manufacturer.agent}
              onChange={(e) => setManufacturer({ ...manufacturer, agent: e.target.value })}
              placeholder="Enter agent name"
              className="w-full px-4 py-3 bg-white text-gray-900 placeholder-gray-500 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400 transition"
              required={manufacturer.has_agent}
            />
          </div>
        )}

        {/* Description */}
        <div>
          <label htmlFor="description" className="block text-gray-800 text-sm font-medium mb-1">
            Description (Optional)
          </label>
          <textarea
            id="description"
            value={manufacturer.description}
            onChange={(e) => setManufacturer({ ...manufacturer, description: e.target.value })}
            rows="4"
            placeholder="Add any additional notes..."
            className="w-full px-4 py-3 bg-white text-gray-900 placeholder-gray-500 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400 resize-none transition"
          ></textarea>
        </div>

        <button
          type="submit"
          className="w-full sm:w-auto px-6 py-3 bg-black text-white font-medium rounded-lg hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-700 transition shadow-md"
        >
          {id ? 'Update Manufacturer' : 'Add Manufacturer'}
        </button>
      </form>
    </div>
  );
};

export default AddManufacturer;
