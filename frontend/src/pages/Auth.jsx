import React, { useState, useContext } from "react";
import axios from "axios";
import { AppContext } from "../context/AppContext";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { assets } from "../assets/assets";
import { Loader2 } from "lucide-react";


const Auth = () => {

  const imagrUrl = "https://res.cloudinary.com/dwtfs2eeu/image/upload/v1760572613/distributors/1760572612996-Banner_Testing_Microbiology-Testing_v1.jpg"
  const { backendUrl, loginUser } = useContext(AppContext);
  const navigate = useNavigate();
  const [isDisabled, setIsDisabled] = useState(false);
  const [loading, setLoading] = useState(false)
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });




  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsDisabled(true);
    setLoading(true)
    try {
      const endpoint = isLogin ? "login" : "register";
      const { data } = await axios.post(
        `${backendUrl}/api/auth/${endpoint}`,
        formData
      );

      if (data.success) {
        loginUser(data);
        toast.success(
          isLogin ? "Welcome back!" : "Account created successfully!"
        );
        navigate("/");
      } else {
        toast.error(data.message || "Something went wrong");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || err.message);
    } finally {
      setIsDisabled(false)
      setLoading(false)
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* القسم الأيسر */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center items-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-8">
        <div className="flex items-center gap-2 mb-8">
          <img src={assets.icon} alt="MedDevice" className="w-14" />
          <h1 className="text-3xl font-bold text-white">MedDevice</h1>
        </div>

        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl shadow-xl w-full max-w-md p-8">
          <h2 className="text-3xl font-semibold text-white text-center mb-6">
            {isLogin ? "Welcome Back 👋" : "Create an Account ✨"}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-5">
            {!isLogin && (
              <div>
                <label className="block text-gray-300 text-sm mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required={!isLogin}
                  placeholder="Your name"
                  className="w-full px-4 py-2 rounded-lg bg-gray-800 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            )}

            <div>
              <label className="block text-gray-300 text-sm mb-1">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="example@mail.com"
                className="w-full px-4 py-2 rounded-lg bg-gray-800 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-gray-300 text-sm mb-1">
                Password
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                placeholder="••••••••"
                className="w-full px-4 py-2 rounded-lg bg-gray-800 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            {
              loading ? (
                <p

                  className={`w-full flex items-center gap-2 justify-center py-2.5 rounded-lg ${isDisabled ? "bg-indigo-300 cursor-not-allowed" : " bg-indigo-600  hover:bg-indigo-500 cursor-pointer"}  text-white font-semibold transition-all `}
                >
                  <Loader2 className="animate-spin w-6 h-6 mr-2" /> Sigining in
                </p>
              ) : (
                <button
                  type="submit"
                  className={`w-full py-2.5 rounded-lg ${isDisabled ? "bg-indigo-300 cursor-not-allowed" : " bg-indigo-600  hover:bg-indigo-500 cursor-pointer"}  text-white font-semibold transition-all `}
                >
                  {isLogin ? "Sign In" : "Register"}
                </button>
              )
            }
          </form>

          <p className="text-gray-400 text-sm text-center mt-5">
            {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
            <span
              onClick={() => setIsLogin(!isLogin)}
              className="text-indigo-400 cursor-pointer hover:text-indigo-300 font-medium"
            >
              {isLogin ? "Create one" : "Sign in"}
            </span>
          </p>
        </div>
      </div>

      {/* القسم الأيمن */}
      <div className="hidden lg:flex w-1/2 relative">
        <img
          src={imagrUrl}
          alt="Medical equipment"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/50" />
        <div className="relative z-10 flex flex-col justify-center items-center text-center text-white px-10">
          <h2 className="text-4xl font-bold mb-4">Advanced Medical Solutions</h2>
          <p className="text-lg max-w-md">
            Explore the most advanced medical devices and technologies to
            improve healthcare outcomes.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Auth;
