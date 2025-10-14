import React, { useContext, useEffect, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { token, user, setToken, setUser } = useContext(AppContext);
  const navigate = useNavigate();
  const [checkingAuth, setCheckingAuth] = useState(true);

  useEffect(() => {
    // تحقق من وجود token في الـ localStorage إذا لم يكن موجود في السياق
    const storedToken = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");

    if (!token && storedToken) {
      setToken(storedToken);
      if (storedUser) setUser(JSON.parse(storedUser));
    }

    // انتظر حتى يتم استعادة البيانات
    setTimeout(() => setCheckingAuth(false), 200);
  }, [token, setToken, setUser]);

  // أثناء فحص حالة المصادقة
  if (checkingAuth) {
    return (
      <div className="flex justify-center items-center h-[60vh] text-gray-500">
        Checking authentication...
      </div>
    );
  }

  // إذا لا يوجد توكن بعد التحقق النهائي
  if (!token) {
    return <Navigate to="/auth" replace />;
  }

  // إذا تم تحديد أدوار ولم يكن المستخدم من ضمنها
  if (allowedRoles && !allowedRoles.includes(user?.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  // ✅ المستخدم مصادق عليه ومسموح له
  return children;
};

export default ProtectedRoute;
