import React, { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AppContext } from '../context/AppContext';
import { BookMarked, Building2, Mail, Phone, User, User2, UserPlus } from 'lucide-react';

const Suppliers = () => {
  const navigate = useNavigate();
  const { backendUrl } = useContext(AppContext);
  const placeholderImage =
    "https://cdn-icons-png.freepik.com/256/11680/11680860.png?semt=ais_white_label";


  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchSuppliers = async () => {
      try {
        const res = await axios.get(`${backendUrl}/api/distributor`);
        setSuppliers(res.data.distributors || []);
      } catch (err) {
        console.error('Error fetching suppliers:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchSuppliers();
  }, [backendUrl]);

  // فلترة الموردين حسب البحث
  const filteredSuppliers = suppliers.filter((s) =>
    s.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="mt-28 w-[90%] sm:w-[80%] mx-auto">
      {/* 🔍 شريط البحث + زر الإضافة */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8">
        <div className="w-full sm:w-1/2">
          <input
            type="text"
            placeholder="Search distributor..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-5 py-2 border border-gray-300 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
        </div>

        <button
          onClick={() => navigate('/add-supplier')}
          className="flex items-center gap-2 bg-black text-white px-5 py-2 rounded-xl hover:bg-gray-800 transition-all shadow-md"
        >
          <UserPlus className="w-5 h-5" />
          <span>Add Distributor</span>
        </button>
      </div>

      {/* 🧾 قائمة الموردين */}
      {loading ? (
        <p className="text-center text-gray-500">Loading distributors...</p>
      ) : filteredSuppliers.length === 0 ? (
        <p className="text-center text-gray-500">No distributors found</p>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSuppliers.map((s) => (
            <div
              key={s._id}
              className="p-5 bg-white rounded-2xl shadow-md hover:shadow-xl border border-gray-100 cursor-pointer transition-all hover:scale-[1.02]"
              onClick={() => navigate(`/supplier/${s._id}`)}
            >
              <img
                src={s.image || placeholderImage}
                alt={s.name}
                className='w-full h-44 object-cover'
                onError={(e) => { e.target.src = placeholderImage }}
              />
              <div className="flex items-center mt-4 gap-3 mb-3">
                <Building2 className="text-blue-600 w-6 h-6" />
                <h2 className="text-xl font-semibold text-gray-800">{s.name}</h2>
              </div>
              <h2 className='text-sm  font-semibold'>Contact Information:</h2>
              <hr className='text-gray-300' />
              <p className="text-gray-600 text-sm flex items-center gap-2 my-1">
                <User2 className="w-4 h-4 text-gray-500" />
                <span className="font-medium">Name:</span> {s.contact_name || '---'}
              </p>
              {s.position && (
                <p className="text-gray-600 text-sm flex items-center  gap-2">
                  <BookMarked className='w-4 h-4 text-gray-500' />
                  <span className="font-medium">Position:</span> {s.position}
                </p>
              )}
              <p className="text-gray-600 text-sm flex items-center gap-2 mb-1">
                <Mail className="w-4 h-4 text-gray-500" />
                {s.email || 'No email'}
              </p>

              <p className="text-gray-600 text-sm flex items-center gap-2 mb-1">
                <Phone className="w-4 h-4 text-gray-500" />
                {s.phone || 'No phone'}
              </p>


            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Suppliers;
