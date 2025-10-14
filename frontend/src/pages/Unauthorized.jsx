import { motion } from "framer-motion";
import { ShieldAlert } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Unauthorized = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-100 to-gray-300 text-gray-800 px-6">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 120 }}
        className="text-center"
      >
        <div className="flex justify-center mb-6">
          <ShieldAlert className="w-20 h-20 text-red-500" />
        </div>

        <h1 className="text-4xl font-bold mb-3">Access Denied</h1>
        <p className="text-lg text-gray-600 mb-8">
          You don’t have permission to view this page.
        </p>

        <div className="flex justify-center gap-4">
          <button
            onClick={() => navigate("/")}
            className="px-6 py-3 rounded-2xl bg-blue-600 text-white font-medium hover:bg-blue-700 transition-colors"
          >
            Go Home
          </button>
          <button
            onClick={() => navigate("/login")}
            className="px-6 py-3 rounded-2xl border border-gray-400 text-gray-700 hover:bg-gray-200 transition-colors"
          >
            Login
          </button>
        </div>
      </motion.div>

      <motion.footer
        className="absolute bottom-4 text-sm text-gray-500"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
      >
        © {new Date().getFullYear()} Medical Devices Portal
      </motion.footer>
    </div>
  );
};

export default Unauthorized;
