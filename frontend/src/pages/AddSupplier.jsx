import React, { useContext, useState } from 'react';
import axios from 'axios'
import { toast } from 'react-toastify'
import { AppContext } from '../context/AppContext';


const AddSupplier = () => {

  const { backendUrl, addSup, setAddSup } = useContext(AppContext)
  const [isDisabled, setIsDisabled] = useState(false);
  const [imageFile, setImageFile] = useState(null); // ⬅️ لتخزين الصورة
  const [distributorForm, setDistributorForm] = useState({
    name: '',
    email: '',
    contact_name: '',
    phone: '',
    telephone: '',
    address: '',
    position: '',
    website: '',
    country: '',
    description: '',
  });

  const handleFileChange = (e) => {
    setImageFile(e.target.files[0]);
  };


  const handelSubmit = async (e) => {
    e.preventDefault();
    setIsDisabled(true);
    setAddSup(!addSup);

    try {
      // ✅ استخدم FormData بدلاً من JSON
      const formData = new FormData();
      for (const key in distributorForm) {
        formData.append(key, distributorForm[key]);
      }

      // ✅ أضف الصورة بنفس اسم الحقل في multer
      if (imageFile) {
        formData.append('image', imageFile);
      }

      const response = await axios.post(
        `${backendUrl}/api/distributor/add`,
        formData,
        { headers: { 'Content-Type': 'multipart/form-data' } }
      );

      if (response.data.success) {
        toast.success('Supplier Added');
        setDistributorForm({
          name: '',
          contact_name: '',
          email: '',
          phone: '',
          telephone: '',
          address: '',
          position: '',
          website: '',
          country: '',
          description: '',
        });
        setImageFile(null); // إعادة تعيين الصورة بعد الرفع
      } else {
        toast.error(response.data.message || 'Failed to add supplier');
      }
    } catch (error) {
      console.error('Submission error:', error);
      toast.error(error.response?.data?.message || 'An error occurred. Please try again.');
    } finally {
      setIsDisabled(false);
    }
  };




  return (
    <div className="mt-30 w-[90%] sm:w-[80%] mx-auto">
      <form onSubmit={handelSubmit} className="p-6 bg-gray-100 rounded-xl shadow-sm border border-gray-200 space-y-6">
        <div className='flex flex-col md:flex-row items-center gap-4'>
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
          {/* Supplier Name & country*/}
          <div className='w-full'>
            <div>
              <label htmlFor="name" className="block text-gray-800 text-sm font-medium mb-1">
                Distirbutor name:
              </label>
              <input
                type="text"
                id="name"
                value={distributorForm.name}
                onChange={(e) => setDistributorForm({ ...distributorForm, name: e.target.value })}
                placeholder="Enter Company name"
                className="w-full px-4 py-3 bg-white text-gray-900 placeholder-gray-500 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent transition"
              />
            </div>

            <div>
              <label htmlFor="country" className="block text-gray-800 text-sm font-medium mb-1">
                Country:
              </label>
              <input
                type="text"
                id="country"
                value={distributorForm.country}
                onChange={(e) => setDistributorForm({ ...distributorForm, country: e.target.value })}
                placeholder="Enter Country "
                className="w-full px-4 py-3 bg-white text-gray-900 placeholder-gray-500 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent transition"
              />
            </div>

            {/* Website */}
            <div>
              <label htmlFor="website" className="block text-gray-800 text-sm font-medium mb-1">
                Website:
              </label>
              <input
                type="text"
                id="website"
                value={distributorForm.website}
                onChange={(e) => setDistributorForm({ ...distributorForm, website: e.target.value })}
                placeholder="Enter  website..."
                className="w-full px-4 py-3 bg-white text-gray-900 placeholder-gray-500 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent transition"
              />
            </div>
          </div>
        </div>
        {/* Contact Informatio */}

        <h2 className='text-lg font-semibold'>Contact Information:</h2>

        {/* Contact Name */}
        <div>
          <label htmlFor="contact_name" className="block text-gray-800 text-sm font-medium mb-1">
            Contact name:
          </label>
          <input
            type="text"
            id="contact_name"
            value={distributorForm.contact_name}
            onChange={(e) => setDistributorForm({ ...distributorForm, contact_name: e.target.value })}
            placeholder="Enter Contact name..."
            className="w-full px-4 py-3 bg-white text-gray-900 placeholder-gray-500 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent transition"
          />
        </div>

        {/* position */}
        <div>
          <label htmlFor="position" className="block text-gray-800 text-sm font-medium mb-1">
            position:
          </label>
          <input
            type="text"
            id="position"
            value={distributorForm.position}
            onChange={(e) => setDistributorForm({ ...distributorForm, position: e.target.value })}
            placeholder="Position"
            className="w-full px-4 py-3 bg-white text-gray-900 placeholder-gray-500 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent transition"
          />
        </div>

        {/* Email */}
        <div>
          <label htmlFor="email" className="block text-gray-800 text-sm font-medium mb-1">
            Email
          </label>
          <input
            type="email"
            id="email"
            value={distributorForm.email}
            onChange={(e) => setDistributorForm({ ...distributorForm, email: e.target.value })}
            placeholder="example@supplier.com"
            className="w-full px-4 py-3 bg-white text-gray-900 placeholder-gray-500 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent transition"
          />
        </div>


        {/* Phone & Tel */}
        <div className='flex flex-col md:flex-row items-center gap-5 '>
          <div className='w-full md:w-1/2'>
            <label htmlFor="phone" className="block text-gray-800 text-sm font-medium mb-1">
              Mobile:
            </label>
            <input
              type="tel"
              id="phone"
              value={distributorForm.phone || ""}
              onChange={(e) => setDistributorForm({ ...distributorForm, phone: e.target.value })}
              placeholder="+123 456 7890"
              className="w-full px-4 py-3 bg-white text-gray-900 placeholder-gray-500 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent transition"
            />
          </div>
          <div className='w-full md:w-1/2'>
            <label htmlFor="tel" className="block text-gray-800 text-sm font-medium mb-1">
              Telephone:
            </label>
            <input
              type="tel"
              id="tel"
              value={distributorForm.telephone || ""}
              onChange={(e) => setDistributorForm({ ...distributorForm, telephone: e.target.value })}
              placeholder="+123 456 7890"
              className="w-full px-4 py-3 bg-white text-gray-900 placeholder-gray-500 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent transition"
            />
          </div>
        </div>

        <div>
          <label htmlFor="address" className="block text-gray-800 text-sm font-medium mb-1">
            Address:
          </label>
          <input
            type="text"
            id="address"
            value={distributorForm.address}
            onChange={(e) => setDistributorForm({ ...distributorForm, address: e.target.value })}
            placeholder="Address..."
            className="w-full px-4 py-3 bg-white text-gray-900 placeholder-gray-500 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent transition"
          />
        </div>

        {/* Description */}
        <div>
          <label htmlFor="description" className="block text-gray-800 text-sm font-medium mb-1">
            Description (Optional)
          </label>
          <textarea

            id="description"
            rows="4"
            value={distributorForm.description}
            onChange={(e) => setDistributorForm({ ...distributorForm, description: e.target.value })}
            placeholder="Add any additional notes..."
            className="w-full px-4 py-3 bg-white text-gray-900 placeholder-gray-500 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent resize-none transition"
          ></textarea>
        </div>
        {/* Submit Button */}
        <button
          type="submit"
          className={`w-full sm:w-auto px-6 py-3 bg-black text-white font-medium rounded-lg ${isDisabled ? "bg-gray-400 cursor-not-allowed" : "bg-black hover:bg-gray-800"} hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-700 focus:ring-offset-2 focus:ring-offset-gray-100 transition shadow-md`}
        >
          Add Distributor
        </button>
      </form>
    </div>
  );
};

export default AddSupplier;