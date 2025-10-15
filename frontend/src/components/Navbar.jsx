import React, { useContext, useState } from "react";
import { assets } from "../assets/assets";
import { MdDeviceHub } from "react-icons/md";
import { ImBarcode } from "react-icons/im";
import { FaHome } from "react-icons/fa";
import { IoIosApps, IoIosMenu, IoMdClose } from "react-icons/io";
import { NavLink, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { AppContext } from "../context/AppContext";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const { token, logoutUser } = useContext(AppContext)
  const navigate = useNavigate()
  return (
    <>
      {/* Navbar */}
      <div className="w-full py-2 fixed left-0 top-0 backdrop-blur-lg bg-white/80 shadow z-[200]">
        <div className="w-[90%] h-16 sm:w-[80%] mx-auto flex items-center justify-between gap-6">
          {/* Logo */}
          <div className="flex items-center gap-1">
            <img className="w-16" src={assets.icon} alt="Logo" />
            <p className="text-xl font-semibold">MedDevice</p>
          </div>

          {/* Desktop Menu */}
          <div className="hidden text-gray-600 lg:flex items-center gap-3">
            <NavLink
              to={"/"}
              className="flex items-center gap-1 py-1 px-2 hover:text-black"
            >
              <FaHome />
              <p className="text-md font-medium">Home</p>
            </NavLink>

            <NavLink
              to={"/device"}
              className="flex items-center gap-1 py-1 px-2 hover:text-black"
            >
              <MdDeviceHub />
              <p className="text-md font-medium">Devices</p>
            </NavLink>

            <NavLink
              to={"/supplier"}
              className="flex items-center gap-1 py-1 px-2 hover:text-black"
            >
              <IoIosApps />
              <p className="text-md font-medium">Distributors</p>
            </NavLink>

            <NavLink
              to={"/manufacturer"}
              className="flex items-center gap-1 py-1 px-2 hover:text-black"
            >
              <ImBarcode />
              <p className="text-md font-medium">Manufacturers</p>
            </NavLink>
          </div>

          {/* Buttons */}
          <div className="hidden lg:flex items-center gap-3">

            {
              token ? <button onClick={() => logoutUser()} className="px-7 py-2 bg-black text-white text-sm font-medium rounded hover:bg-gray-700">
                Logout
              </button>
                :
                <button onClick={() => navigate('/auth')} className="px-7 py-2 bg-black text-white text-sm font-medium rounded hover:bg-gray-700">
                  Sign up
                </button>
            }
          </div>

          {/* Mobile Menu Button */}
          <div className="flex lg:hidden">
            <IoIosMenu
              className="text-4xl cursor-pointer"
              onClick={() => setMenuOpen(true)}
            />
          </div>
        </div>

        <hr className="border-none h-[1px] bg-gray-300" />
      </div>

      {/* Mobile Slide Menu */}
      <AnimatePresence>
        {menuOpen && (
          <>
            {/* خلفية شفافة */}
            <motion.div
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[100]"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMenuOpen(false)}
            />

            {/* القائمة الجانبية */}
            <motion.div
              className="fixed top-0 right-0 h-full w-64 bg-white shadow-2xl z-[1000] flex flex-col p-6 space-y-6"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 80 }}
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold">Menu</h3>
                <IoMdClose
                  className="text-3xl cursor-pointer"
                  onClick={() => setMenuOpen(false)}
                />
              </div>

              <NavLink
                to={"/"}
                className="flex items-center gap-2 py-2 border-b border-gray-200"
                onClick={() => setMenuOpen(false)}
              >
                <FaHome /> Home
              </NavLink>
              <NavLink
                to={"/device"}
                className="flex items-center gap-2 py-2 border-b border-gray-200"
                onClick={() => setMenuOpen(false)}
              >
                <MdDeviceHub /> Devices
              </NavLink>
              <NavLink
                to={"/supplier"}
                className="flex items-center gap-2 py-2 border-b border-gray-200"
                onClick={() => setMenuOpen(false)}
              >
                <IoIosApps /> Suppliers
              </NavLink>
              <NavLink
                to={"/manufacturer"}
                className="flex items-center gap-2 py-2 border-b border-gray-200"
                onClick={() => setMenuOpen(false)}
              >
                <ImBarcode /> Manufacturers
              </NavLink>

              <div className="mt-6 space-y-3">
                {
                  token ?
                    <button onClick={() => { logoutUser(); navigate('/auth') }} className="w-full px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700">
                      Logout
                    </button>
                    :
                    <button onClick={() => navigate('/auth')} className="w-full px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700">
                      Sign up
                    </button>
                }
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
