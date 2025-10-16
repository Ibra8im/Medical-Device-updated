import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { AppContext } from "../context/AppContext";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { toast } from "react-toastify";

const Manufacturers = () => {
  const { backendUrl } = useContext(AppContext);
  const navigate = useNavigate();
  const placeholderImage =
    "https://cdn-icons-png.freepik.com/256/11680/11680860.png?semt=ais_white_label";
  const [manufacturers, setManufacturers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchManufacturers = async () => {
    try {
      const res = await axios.get(`${backendUrl}/api/manufacturer`);
      if (res.data.success) setManufacturers(res.data.manufacturers);
    } catch (err) {
      toast.error("Failed to fetch manufacturers");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchManufacturers();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this manufacturer?")) return;
    try {
      await axios.delete(`${backendUrl}/api/manufacturer/${id}`);
      setManufacturers((prev) => prev.filter((m) => m._id !== id));
      toast.success("Manufacturer deleted successfully");
    } catch (err) {
      toast.error(err.message);
    }
  };

  const filtered = manufacturers.filter((m) =>
    m.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading)
    return (
      <div className="flex justify-center items-center h-[50vh] text-gray-500">
        Loading manufacturers...
      </div>
    );

  return (
    <div className="mt-30 max-w-6xl mx-auto px-4 sm:px-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6">
        <input
          type="text"
          placeholder="Search manufacturer..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full sm:w-1/2 border border-gray-300 px-4 py-2 rounded-lg focus:ring-2 focus:ring-black"
        />
        <button
          onClick={() => navigate("/add-manufacturer")}
          className="flex items-center gap-2 px-5 py-2 bg-black text-white rounded-xl hover:bg-gray-800 transition-all"
        >
          + Add Manufacturer
        </button>
      </div>

      {/* Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((m) => (
          <motion.div
            key={m._id}
            onClick={() => navigate(`/manufacturer/${m._id}`)}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white shadow-lg rounded-2xl p-6 hover:shadow-2xl transition flex flex-col justify-between cursor-pointer"
          >
            <img
              src={m.image || placeholderImage}
              alt={m.name}
              className='w-full h-44 object-cover'
              onError={(e) => { e.target.src = placeholderImage }}
            />
            <div>
              <h2 className="text-xl font-semibold text-gray-800 mb-2">{m.name}</h2>
              <p className="text-gray-600 mb-1"><strong>Country:</strong> {m.country}</p>
              <p className="text-gray-600 mb-1">
                <strong>Has Agent:</strong> {m.has_agent ? m.agent || "Yes" : "No"}
              </p>
              <p className="text-gray-600 mb-4 text-sm max-h-20 overflow-y-auto">{m.description || "No description"}</p>
            </div>

            <div className="flex gap-2 mt-4">



            </div>
          </motion.div>
        ))}

        {filtered.length === 0 && (
          <div className="col-span-full text-center py-10 text-gray-500">
            No manufacturers found.
          </div>
        )}
      </div>
    </div>
  );
};

export default Manufacturers;
