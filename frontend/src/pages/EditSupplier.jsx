import React, { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { AppContext } from "../context/AppContext";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Globe,
  FileText,
  Building2,
  Image as ImageIcon,
  Flag,
} from "lucide-react";

const EditSupplier = () => {
  const { backendUrl } = useContext(AppContext);
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    contact_name: "",
    email: "",
    phone: "",
    telephone: "",
    address: "",
    position: "",
    website: "",
    country: "",
    description: "",
    image: "",
  });
  const [imageFile, setImageFile] = useState(null);
  const [loading, setLoading] = useState(true);

  // ✅ جلب بيانات المورد
  useEffect(() => {
    const fetchSupplier = async () => {
      try {
        const res = await axios.get(`${backendUrl}/api/distributor/${id}`);
        if (res.data.success) {
          setForm(res.data.distributor);
        } else {
          toast.error("Failed to load supplier");
        }
      } catch (err) {
        console.error(err);
        toast.error("Error loading supplier");
      } finally {
        setLoading(false);
      }
    };
    fetchSupplier();
  }, [backendUrl, id]);

  const handleChange = (field, value) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const handleFileChange = (e) => setImageFile(e.target.files[0]);

  // ✅ التحديث مع الصورة
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("id", id);

      for (const key in form) formData.append(key, form[key]);
      if (imageFile) formData.append("image", imageFile);

      const res = await axios.put(`${backendUrl}/api/distributor/update/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (res.data.success) {
        toast.success("Supplier updated successfully!");
        navigate(`/supplier/${id}`);
      } else toast.error(res.data.message || "Failed to update supplier");
    } catch (err) {
      console.error(err);
      toast.error("Error updating supplier");
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this supplier?")) return;
    try {
      const res = await axios.delete(`${backendUrl}/api/distributor/remove`, {
        data: { id },
      });
      if (res.data.success) {
        toast.success("Supplier deleted successfully!");
        navigate("/supplier");
      } else toast.error("Failed to delete supplier");
    } catch (err) {
      console.error(err);
      toast.error("Error deleting supplier");
    }
  };

  if (loading)
    return (
      <p className="text-center mt-10 text-gray-600 text-lg animate-pulse">
        Loading Distributor details...
      </p>
    );

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-4xl mx-auto mt-20 p-8 bg-gray-100 rounded-2xl shadow border border-gray-200 space-y-6"
    >
      <h1 className="text-3xl font-semibold mb-6 text-gray-800 border-b pb-3">
        ✏️ Edit Supplier Information
      </h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* 🖼️ صورة المورد */}
        <div className="flex flex-col md:flex-row items-center gap-6">
          <div className="flex flex-col items-center">
            <label htmlFor="image" className="cursor-pointer group">
              <div className="w-48 h-48 border-2 border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center bg-white hover:bg-gray-50 transition-colors">
                {imageFile ? (
                  <img
                    src={URL.createObjectURL(imageFile)}
                    alt="preview"
                    className="w-full h-full object-cover rounded-xl"
                  />
                ) : form.image ? (
                  <img
                    src={form.image}
                    alt="supplier"
                    className="w-full h-full object-cover rounded-xl"
                  />
                ) : (
                  <>
                    <ImageIcon className="h-10 w-10 text-gray-400 group-hover:text-gray-500 transition-colors" />
                    <p className="mt-2 text-sm text-gray-500 group-hover:text-gray-600 transition-colors">
                      Click to upload
                    </p>
                  </>
                )}
              </div>
              <input
                id="image"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileChange}
              />
            </label>
            <p className="mt-2 text-xs text-gray-500 text-center">
              JPG, PNG, JPEG (max 5MB)
            </p>
          </div>

          {/* 🏢 معلومات الشركة */}
          <div className="w-full">
            <label className="block text-gray-700 font-medium mb-1">Company Name</label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => handleChange("name", e.target.value)}
              className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-black"
              placeholder="Enter Company name"
            />

            <label className="block mt-3 text-gray-700 font-medium mb-1">Country</label>
            <input
              type="text"
              value={form.country}
              onChange={(e) => handleChange("country", e.target.value)}
              className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-black"
              placeholder="Enter Country"
            />

            <label className="block mt-3 text-gray-700 font-medium mb-1">Website</label>
            <input
              type="text"
              value={form.website}
              onChange={(e) => handleChange("website", e.target.value)}
              className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-black"
              placeholder="https://example.com"
            />
          </div>
        </div>

        {/* 👤 معلومات التواصل */}
        <h2 className="text-lg font-semibold border-b pb-2">Contact Information</h2>

        <div>
          <label className="block text-gray-700 font-medium mb-1">Contact Name</label>
          <input
            type="text"
            value={form.contact_name}
            onChange={(e) => handleChange("contact_name", e.target.value)}
            className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-black"
            placeholder="Enter Contact name"
          />
        </div>

        <div>
          <label className="block text-gray-700 font-medium mb-1">Position</label>
          <input
            type="text"
            value={form.position}
            onChange={(e) => handleChange("position", e.target.value)}
            className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-black"
            placeholder="Manager / Sales Rep"
          />
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-gray-700 font-medium mb-1">Mobile</label>
            <input
              type="tel"
              value={form.phone}
              onChange={(e) => handleChange("phone", e.target.value)}
              className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-black"
              placeholder="+123 456 7890"
            />
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-1">Telephone</label>
            <input
              type="tel"
              value={form.telephone}
              onChange={(e) => handleChange("telephone", e.target.value)}
              className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-black"
              placeholder="+123 456 7890"
            />
          </div>
        </div>

        <div>
          <label className="block text-gray-700 font-medium mb-1">Address</label>
          <input
            type="text"
            value={form.address}
            onChange={(e) => handleChange("address", e.target.value)}
            className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-black"
            placeholder="Address..."
          />
        </div>

        <div>
          <label className="block text-gray-700 font-medium mb-1">Description</label>
          <textarea
            value={form.description}
            onChange={(e) => handleChange("description", e.target.value)}
            rows="4"
            className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-black resize-none"
            placeholder="Additional notes..."
          ></textarea>
        </div>

        {/* أزرار التحكم */}
        <div className="flex flex-wrap gap-4 pt-4">
          <button
            type="submit"
            className="px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition"
          >
            💾 Update Supplier
          </button>
          <button
            type="button"
            onClick={handleDelete}
            className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-500 transition"
          >
            🗑 Delete Supplier
          </button>
          <button
            type="button"
            onClick={() => navigate("/supplier")}
            className="px-6 py-3 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition"
          >
            ↩️ Back
          </button>
        </div>
      </form>
    </motion.div>
  );
};

export default EditSupplier;
