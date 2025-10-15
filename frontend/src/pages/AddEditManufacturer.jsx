import React, { useContext, useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { AppContext } from "../context/AppContext";
import Select from "react-select";
import { toast } from "react-toastify";
import AddSupplier from "./AddSupplier";
import { AnimatePresence, motion } from "framer-motion";

const AddEditManufacturer = () => {
  const { backendUrl, addSup } = useContext(AppContext);
  const { id } = useParams(); // موجود فقط عند التعديل
  const navigate = useNavigate();

  const [distributors, setDistributors] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [popup, setPopup] = useState(false);
  const [isDisabled, setIsDisabled] = useState(false);
  const [imageFile, setImageFile] = useState(null); // صورة جديدة
  const [manufacturer, setManufacturer] = useState({
    name: "",
    country: "",
    contact_name: "",
    email: "",
    position: "",
    mobile: "",
    telephone: "",
    website: "",
    address: "",
    distributors: [],
    description: "",
    has_agent: false,
    image: "", // رابط الصورة القديمة
  });

  // ✅ تحميل قائمة الموزعين
  const fetchDistributors = async () => {
    try {
      const response = await axios.get(`${backendUrl}/api/distributor`);
      setDistributors(response.data.distributors || []);
    } catch (err) {
      console.error("Error fetching distributors:", err);
      setError("Failed to load distributors");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDistributors();
  }, [backendUrl, popup]);

  // ✅ جلب بيانات المصنع عند التعديل
  useEffect(() => {
    const fetchManufacturer = async () => {
      if (!id) return;
      try {
        const res = await axios.get(`${backendUrl}/api/manufacturer/${id}`);
        if (res.data.success && res.data.manufacturer) {
          const m = res.data.manufacturer;
          setManufacturer({
            name: m.name || "",
            country: m.country || "",
            contact_name: m.contact_name || "",
            email: m.email || "",
            position: m.position || "",
            mobile: m.mobile || "",
            telephone: m.telephone || "",
            website: m.website || "",
            address: m.address || "",
            distributors:
              m.distributors?.map((d) => ({ value: d._id, label: d.name })) || [],
            description: m.description || "",
            has_agent: m.has_agent || false,
            image: m.image || "",
          });
        } else {
          toast.error("Failed to load manufacturer data");
        }
      } catch (err) {
        console.error("Error fetching manufacturer:", err);
        toast.error("Error loading manufacturer data");
      }
    };

    fetchManufacturer();
  }, [id, backendUrl]);

  // ✅ خيارات select الخاصة بالموزعين
  const distributorOptions = distributors.map((item) => ({
    value: item._id,
    label: item.name,
  }));

  // ✅ تغيير البيانات
  const handleInputChange = (key, value) => {
    setManufacturer((prev) => ({ ...prev, [key]: value }));
  };

  const handleFileChange = (e) => {
    setImageFile(e.target.files[0]);
  };

  // ✅ إرسال البيانات
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsDisabled(true);

    try {
      const formData = new FormData();

      // إضافة جميع الحقول عدا الموزعين
      for (const key in manufacturer) {
        if (key !== "distributors" && key !== "image") {
          formData.append(key, manufacturer[key]);
        }
      }

      // إضافة الموزعين
      formData.append(
        "distributors",
        JSON.stringify(manufacturer.distributors.map((d) => d.value))
      );

      // إضافة الصورة إذا تم اختيار واحدة جديدة
      if (imageFile) {
        formData.append("image", imageFile);
      }

      let res;
      if (id) {
        // تحديث المصنع
        res = await axios.put(`${backendUrl}/api/manufacturer/${id}`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      } else {
        // إضافة مصنع جديد
        res = await axios.post(`${backendUrl}/api/manufacturer/add`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      }

      if (res.data.success) {
        toast.success(
          id ? "✅ Manufacturer updated successfully!" : "✅ Manufacturer added successfully!"
        );
        navigate("/manufacturer");
      } else {
        toast.error(res.data.message || "Something went wrong");
      }
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || err.message);
    } finally {
      setIsDisabled(false);
    }
  };

  // ✅ حفظ موزّع جديد
  const handleSaveDistributor = async (newDist) => {
    try {
      const res = await axios.post(`${backendUrl}/api/distributor/add`, newDist);
      if (res.data.success) {
        toast.success("✅ Distributor added successfully!");
        fetchDistributors();
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to add distributor");
    }
  };

  return (
    <div className="mt-30 w-[90%] sm:w-[80%] mx-auto relative">
      <form
        onSubmit={handleSubmit}
        className="p-6 bg-white rounded-xl shadow-md border border-gray-200 space-y-6"
      >
        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          {id ? "Edit Manufacturer" : "Add Manufacturer"}
        </h1>

        {/* Image & Manufacturer and Country */}
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex flex-col items-center justify-start md:w-64">
            <label htmlFor="device-image" className="cursor-pointer group">
              <div className="w-48 h-48 border-2 border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center bg-white hover:bg-gray-50 transition-colors">
                {imageFile ? (
                  <img
                    src={URL.createObjectURL(imageFile)}
                    alt="preview"
                    className="w-full h-full object-cover rounded-xl"
                  />
                ) : manufacturer.image ? (
                  <img
                    src={manufacturer.image}
                    alt="preview"
                    className="w-full h-full object-cover rounded-xl"
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center text-gray-400">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-10 w-10"
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
                    <p className="mt-2 text-sm">Click to upload</p>
                  </div>
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

          {/* Manufacturer Name & Country */}
          <div className="w-full space-y-4">
            <div>
              <label className="block text-gray-800 text-sm font-medium mb-1">
                Manufacturer Name
              </label>
              <input
                type="text"
                value={manufacturer.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                placeholder="Enter manufacturer name"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-400"
                required
              />
            </div>

            <div>
              <label className="block text-gray-800 text-sm font-medium mb-1">
                Country
              </label>
              <input
                type="text"
                value={manufacturer.country}
                onChange={(e) => handleInputChange("country", e.target.value)}
                placeholder="Enter country"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-400"
              />
            </div>

            <div>
              <label className="block text-gray-800 text-sm font-medium mb-1">
                Website
              </label>
              <input
                type="text"
                value={manufacturer.website}
                onChange={(e) => handleInputChange("website", e.target.value)}
                placeholder="https://example.com"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-400"
              />
            </div>
          </div>
        </div>


        {/* Contact Section */}
        <h2 className="text-lg font-semibold mt-8 mb-3 text-gray-800">
          Contact Information
        </h2>
        <hr />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-gray-800 text-sm font-medium mb-1">
              Contact Name:
            </label>
            <input
              type="text"
              value={manufacturer.contact_name}
              onChange={(e) => handleInputChange("contact_name", e.target.value)}
              placeholder="Enter contact name"
              className="w-full px-4 py-3 bg-gray-50 text-gray-900 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black transition"
            />
          </div>

          <div>
            <label className="block text-gray-800 text-sm font-medium mb-1">
              Position:
            </label>
            <input
              type="text"
              value={manufacturer.position}
              onChange={(e) => handleInputChange("position", e.target.value)}
              placeholder="Position"
              className="w-full px-4 py-3 bg-gray-50 text-gray-900 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black transition"
            />
          </div>
        </div>

        <div>
          <label className="block text-gray-800 text-sm font-medium mb-1">
            Email:
          </label>
          <input
            type="email"
            value={manufacturer.email}
            onChange={(e) => handleInputChange("email", e.target.value)}
            placeholder="example@email.com"
            className="w-full px-4 py-3 bg-gray-50 text-gray-900 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black transition"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-gray-800 text-sm font-medium mb-1">
              Mobile:
            </label>
            <input
              type="tel"
              value={manufacturer.mobile}
              onChange={(e) => handleInputChange("mobile", e.target.value)}
              placeholder="+966 5xxxxxxxx"
              className="w-full px-4 py-3 bg-gray-50 text-gray-900 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black transition"
            />
          </div>

          <div>
            <label className="block text-gray-800 text-sm font-medium mb-1">
              Telephone:
            </label>
            <input
              type="tel"
              value={manufacturer.telephone}
              onChange={(e) => handleInputChange("telephone", e.target.value)}
              placeholder="+966 1xxxxxxxx"
              className="w-full px-4 py-3 bg-gray-50 text-gray-900 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black transition"
            />
          </div>
        </div>



        <div>
          <label className="block text-gray-800 text-sm font-medium mb-1">
            Address:
          </label>
          <input
            type="text"
            value={manufacturer.address}
            onChange={(e) => handleInputChange("address", e.target.value)}
            placeholder="Enter address"
            className="w-full px-4 py-3 bg-gray-50 text-gray-900 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black transition"
          />
        </div>

        {/* ✅ Has Agent */}
        <div className="flex flex-col md:flex-row">
          <div className="flex items-center gap-2 w-full md:w-1/2">
            <input
              type="checkbox"
              checked={manufacturer.has_agent}
              onChange={(e) => handleInputChange("has_agent", e.target.checked)}
              className="w-4 h-4 text-black border-gray-300 rounded focus:ring-black"
            />
            <label className="text-gray-800 text-sm font-medium">
              Has an agent in Saudi Arabia?
            </label>
          </div>

          {/* ✅ Distributors */}
          <div className={`w-full md:w-1/2 ${manufacturer.has_agent ? "block" : "hidden"}`}>
            <label className="block text-gray-800 text-sm font-medium mb-2">
              Distributor(s)
            </label>
            {loading ? (
              <div className="p-2 text-gray-500 text-sm">Loading distributors...</div>
            ) : error ? (
              <div className="p-2 text-red-500 text-sm">{error}</div>
            ) : (
              <div className="flex items-center gap-2 w-full">
                <Select
                  isMulti
                  options={distributorOptions}
                  value={manufacturer.distributors}
                  onChange={(selected) => handleInputChange("distributors", selected)}
                  placeholder="Select distributors..."
                  className="flex-1"
                  classNamePrefix="select"
                />

                <button
                  type="button"
                  onClick={() => setPopup(true)}
                  className="py-2 px-3 text-white bg-black rounded-lg hover:bg-gray-800 transition"
                >
                  + Add
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="block text-gray-800 text-sm font-medium mb-1">
            Description (Optional)
          </label>
          <textarea
            rows="4"
            value={manufacturer.description}
            onChange={(e) => handleInputChange("description", e.target.value)}
            placeholder="Add notes or extra details..."
            className="w-full px-4 py-3 bg-gray-50 text-gray-900 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black transition resize-none"
          ></textarea>
        </div>

        {/* Submit */}
        <button
          type="submit"
          className={`w-full sm:w-auto px-6 py-3 bg-black ${isDisabled ? "bg-gray-400 cursor-not-allowed" : "bg-black hover:bg-gray-800"} text-white font-medium rounded-lg hover:bg-gray-800 transition focus:ring-2 focus:ring-gray-700 shadow-md`}
        >
          {id ? "Update Manufacturer" : "Add Manufacturer"}
        </button>
      </form>

      {/* ✅ Pop-up Add Supplier */}
      <AnimatePresence>
        {popup && (
          <motion.div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-10000 overflow-y-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 40 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 40 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="bg-white rounded-2xl shadow-2xl w-[100%] max-w-lg p-6 relative"
            >
              <button
                onClick={() => setPopup(false)}
                className="absolute bottom-15  right-50 text-black hover:text-gray-700 text-base font-bold"
              >
                close
              </button>
              <AddSupplier
                isOpen={popup}
                onClose={() => setPopup(false)}
                onSave={handleSaveDistributor}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AddEditManufacturer;
