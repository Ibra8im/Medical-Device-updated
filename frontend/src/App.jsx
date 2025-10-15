import React from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Device from './pages/Device';
import Suppliers from './pages/Suppliers';
import Manufacturers from './pages/Manufacturer';
import ManufacturerDetails from './pages/ManufacturerDetails';
import AddEditManufacturer from './pages/AddEditManufacturer';
import AddDevice from './pages/AddDevice';
import AddSupplier from './pages/AddSupplier';
import DeviceDetails from './pages/DeviceDetails';
import EditDevice from './pages/EditDevice';
import SupplierDetails from './pages/SupplierDetails';
import EditSupplier from './pages/EditSupplier';
import Auth from './pages/Auth';
import { Bounce, ToastContainer } from 'react-toastify';
import ProtectedRoute from './components/ProtectedRoute';
import Unauthorized from './pages/Unauthorized';

const App = () => {
  const location = useLocation();

  // لا تعرض الـ Navbar إذا كان المستخدم في صفحة /auth
  const hideNavbar = location.pathname === '/auth';

  return (
    <>
      {!hideNavbar && <Navbar />}

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/device" element={
          <ProtectedRoute allowedRoles={["Admin", "User"]}>
            <Device />
          </ProtectedRoute>
        } />
        <Route path="/add-device" element={
          <ProtectedRoute allowedRoles={["Admin"]}>
            <AddDevice />
          </ProtectedRoute>
        }
        />
        <Route path="/device/:id" element={
          <ProtectedRoute allowedRoles={["Admin"]}>
            <DeviceDetails />
          </ProtectedRoute>
        } />
        <Route path="/edit-device/:id" element={
          <ProtectedRoute allowedRoles={["Admin"]}>
            <EditDevice />
          </ProtectedRoute>
        } />

        <Route path="/supplier" element={
          <ProtectedRoute allowedRoles={["Admin"]}>
            <Suppliers />
          </ProtectedRoute>
        } />
        <Route path="/supplier/:id" element={
          <ProtectedRoute allowedRoles={["Admin"]}>
            <SupplierDetails />
          </ProtectedRoute>
        } />
        <Route path="/add-supplier" element={
          <ProtectedRoute allowedRoles={["Admin"]}>
            <AddSupplier />
          </ProtectedRoute>
        } />
        <Route path="/edit-supplier/:id" element={
          <ProtectedRoute allowedRoles={["Admin"]}>
            <EditSupplier />
          </ProtectedRoute>
        } />

        <Route path="/manufacturer" element={
          <ProtectedRoute allowedRoles={["Admin"]}>
            <Manufacturers />
          </ProtectedRoute>
        } />
        <Route path="/manufacturer/:id" element={
          <ProtectedRoute allowedRoles={["Admin"]}>
            <ManufacturerDetails />
          </ProtectedRoute>
        } />
        <Route path="/add-manufacturer" element={
          <ProtectedRoute allowedRoles={["Admin"]}>
            <AddEditManufacturer />
          </ProtectedRoute>
        } />
        <Route path="/edit-manufacturer/:id" element={
          <ProtectedRoute allowedRoles={["Admin"]}>
            <AddEditManufacturer />
          </ProtectedRoute>
        } />

        <Route path='/unauthorized' element={<Unauthorized />} />

        {/* صفحة الدخول والتسجيل */}
        <Route path="/auth" element={<Auth />} />
      </Routes>

      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick={false}
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        transition={Bounce}
      />
    </>
  );
};

export default App;
