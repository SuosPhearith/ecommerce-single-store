import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import AdminLayout from "../layouts/admin/AdminLayout";
import CustomerLayout from "../layouts/client/CustomerLayout";
import UserLayout from "../layouts/user/UserLayout";
import Login from "../pages/login/Login";
import request from "../services/request";
import HomePage from "../pages/home/HomePage";
import ProfilePage from "../pages/profile/ProfilePage";
import localStorageSave from "../utils/localstorageSave";
import { Spin } from "antd";

const Router = () => {
  const [isLogin, setIsLogin] = useState(null);
  const [role, setRole] = useState(null);

  useEffect(() => {
    const loginStatus = async () => {
      try {
        const response = await request("get", "auth/refresh");
        if (response.status === "success") {
          setIsLogin(true);
          setRole(response.data.user.role);
          localStorageSave(
            response.access_token,
            response.data.user.fullname,
            response.data.user.role
          );
        } else {
          setIsLogin(false);
        }
      } catch (error) {
        setIsLogin(false);
      }
    };

    loginStatus();
  }, []);

  if (isLogin === null) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <Spin />
      </div>
    );
  }

  return (
    <BrowserRouter>
      {isLogin && role === "admin" && (
        <AdminLayout>
          <Routes>
            <Route path="/login" element={<Login />} />
          </Routes>
        </AdminLayout>
      )}
      {isLogin && role === "customer" && (
        <CustomerLayout>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/user" element={<ProfilePage />} />
          </Routes>
        </CustomerLayout>
      )}
      {!isLogin && (
        <UserLayout>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<Login />} />
          </Routes>
        </UserLayout>
      )}
    </BrowserRouter>
  );
};

export default Router;
