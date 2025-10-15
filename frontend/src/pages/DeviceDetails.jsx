import React, { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { AppContext } from "../context/AppContext";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import {
  Loader2,
  Building2,
  Mail,
  Phone,
  Globe,
  MapPin,
  User,
  Info,
  Briefcase,
} from "lucide-react";



const DeviceDetails = () => {
  const { backendUrl } = useContext(AppContext);
  const { id } = useParams();
  const navigate = useNavigate();
  const [device, setDevice] = useState(null);
  const [loading, setLoading] = useState(true);

  const placeholderImage =
    "https://cdn-icons-png.freepik.com/256/11680/11680860.png?semt=ais_white_label";


  const fetchDevice = async () => {
    try {
      const res = await axios.get(`${backendUrl}/api/device/${id}`);
      if (res.data.success) setDevice(res.data.device);

    } catch (error) {
      console.error("Error fetching device:", error);
      toast.error("Failed to fetch device details");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDevice();
  }, [id, backendUrl]);

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this device?")) return;

    try {
      const res = await axios.delete(`${backendUrl}/api/device/remove/${id}`);
      if (res.data.success) {
        toast.success("Device deleted successfully!");
        navigate("/device"); // العودة لقائمة الأجهزة
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete device");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <div className="text-gray-500 text-lg">Loading device details...</div>
      </div>
    );
  }

  if (!device) {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <div className="text-red-500 text-lg">Device not found.</div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-5xl mx-auto mt-10 px-4 sm:px-8"
    >
      {/* Header */}
      <div className="mt-30 flex flex-col sm:flex-row gap-8 bg-white shadow-xl rounded-2xl p-6">
        {/* Image */}
        <div className="flex-1 flex justify-center items-center">
          <img
            src={device.image || placeholderImage}
            alt={device.name}
            onError={(e) => (e.target.src = placeholderImage)}
            className="w-full max-w-sm h-auto rounded-xl object-cover shadow-md"
          />
        </div>

        {/* Info */}
        <div className="flex-1 space-y-4">
          <h1 className="text-3xl font-bold text-gray-800">{device.name}</h1>
          <p className="text-gray-600 text-lg">
            <span className="font-semibold">Model:</span> {device.model || "N/A"}
          </p>
          <p className="text-gray-600 text-lg">
            <span className="font-semibold">Price:</span>{" "}
            {device.price ? `${device.price} SAR` : "Not available"}
          </p>
          <p className="text-gray-600 text-lg">
            <span className="font-semibold">B2B Price:</span>{" "}
            {device.price_p ? `${device.price_p} SAR` : "Not available"}
          </p>

          <p className="text-gray-600">
            <span className="font-semibold">Category:</span> {device.category}{" "}
            / <span className="font-semibold">Subcategory:</span>{" "}
            {device.subcategory || "N/A"}
          </p>

          <hr className="my-3" />

          {/* Manufacturer */}
          <div>
            <h2 className="text-xl font-semibold text-gray-800 mb-2">
              Manufacturer Details
            </h2>
            {typeof device.manufacturer === "object" && device.manufacturer ? (
              <div className="text-gray-700 space-y-1">
                <p>
                  <span className="font-medium">Name:</span>{" "}
                  {device.manufacturer.name}
                </p>
                <p>
                  <span className="font-medium">Country:</span>{" "}
                  {device.manufacturer.country}
                </p>
                <p>
                  <span className="font-medium">Agent:</span>
                  {device.manufacturer.has_agent
                    ? device.manufacturer.agent || "Available"
                    : "  No agent available"}
                </p>

                <p className="text-green-500 font-semibold">
                  <span className="font-medium text-gray-600">Manufacturer Distributors is :  </span>
                  {device.manufacturer.distributors.length}
                </p>


              </div>
            ) : (
              <p className="text-gray-600">Unknown manufacturer</p>
            )}
          </div>

          <hr className="my-3" />

          {/* Device Description */}
          <div>
            <h2 className="text-xl font-semibold text-gray-800 mb-2">
              Device Description
            </h2>
            <p className="text-gray-700 leading-relaxed">
              {device.description || "No description available"}
            </p>
          </div>

          {/* Edit & Delete Buttons */}
          <div className="mt-6 flex gap-4">
            <motion.button
              onClick={() => navigate(`/edit-device/${id}`)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-5 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition"
            >
              Edit Device
            </motion.button>

            <motion.button
              onClick={handleDelete}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-5 py-2 bg-red-600 text-white rounded-lg hover:bg-red-500 transition"
            >
              Delete Device
            </motion.button>
          </div>
        </div>
      </div>

      {/* Distributors Section */}
      {device.distributors && device.distributors.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gray-50 p-6 rounded-xl shadow-inner"
        >
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">
            Distributor(s)
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {device.distributors.map((s) => (
              <motion.div
                key={s._id}
                whileHover={{ scale: 1.02 }}
                className="p-5 border border-gray-200 bg-white rounded-xl hover:shadow-lg transition"
              >
                <h3 className="text-xl font-semibold text-blue-700 mb-3 flex items-center gap-2">
                  <Briefcase className="w-5 h-5 text-blue-600" />
                  {s.name}
                </h3>
                <div className="space-y-1 text-gray-700">
                  <p className="flex items-center gap-2">
                    <User className="w-4 h-4 text-gray-500" />{" "}
                    <strong>Position:</strong> {s.position || "N/A"}
                  </p>
                  <p className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-gray-500" />{" "}
                    <strong>Email:</strong> {s.email || "N/A"}
                  </p>
                  <p className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-gray-500" />{" "}
                    <strong>Phone:</strong> {s.phone || "N/A"}
                  </p>
                  <p className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-gray-500" />{" "}
                    <strong>Tele:</strong> {s.telephone || "N/A"}
                  </p>
                  <p className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-gray-500" />{" "}
                    <strong>Address:</strong> {s.address || "N/A"}
                  </p>
                  <p className="flex items-center gap-2">
                    <Globe className="w-4 h-4 text-gray-500" />{" "}
                    <strong>Website:</strong> {s.website || "N/A"}
                  </p>
                </div>
                <p className="mt-3 text-gray-600 text-sm">
                  {s.description || "No description"}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Back Button */}
      <div className="mt-10 flex justify-center">
        <button
          onClick={() => navigate(-1)}
          className="px-6 py-2 text-white bg-gray-800 rounded-xl hover:bg-gray-700 transition-all"
        >
          Back to Devices
        </button>
      </div>
    </motion.div>
  );
};

export default DeviceDetails;
