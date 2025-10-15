import { createContext, useEffect, useState } from "react";

// إنشاء السياق
const AppContext = createContext();

// مزود السياق (Provider)
const AppContextProvider = ({ children }) => {

  const backendUrl = import.meta.env.VITE_BACKEND_URI || "http://localhost:5000"

  const [addSup, setAddSup] = useState(true)
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [deviceLength, setDeviceLength] = useState(null);
  const [manufacturerLength, setManufacturerLength] = useState(null);
  const [distributorLength, setDistributorLength] = useState(null);

  // تحميل بيانات المستخدم عند بداية التطبيق
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const storedToken = localStorage.getItem("token");

    if (storedUser && storedToken) {
      setUser(JSON.parse(storedUser));
      setToken(storedToken);
    }
  }, []);

  // عند تسجيل الدخول
  const loginUser = (data) => {
    setUser(data.user);
    setToken(data.token);
    localStorage.setItem("user", JSON.stringify(data.user));
    localStorage.setItem("token", data.token);
  };

  // عند تسجيل الخروج
  const logoutUser = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
  };





  const value = {

    backendUrl,
    user, setUser,
    token, setToken,
    loginUser, logoutUser,
    addSup, setAddSup,
    deviceLength, setDeviceLength, manufacturerLength, setManufacturerLength, distributorLength, setDistributorLength

  }
  // يمكنك إضافة وظائف أو حالات أخرى هنا لاحقًا

  return (
    <AppContext.Provider
      value={value}
    >
      {children}
    </AppContext.Provider>
  );
};

export { AppContext, AppContextProvider };