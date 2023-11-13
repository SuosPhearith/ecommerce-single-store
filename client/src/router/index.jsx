import { BrowserRouter, Routes, Route } from "react-router-dom";
import AdminLayout from "../layouts/admin/AdminLayout";
import CustomerLayout from "../layouts/client/CustomerLayout";
import UserLayout from "../layouts/user/UserLayout";
import Login from "../pages/login/LoginPage";
import RegisterPage from "../pages/register/RegisterPage";
import HomePage from "../pages/home/HomePage";
import ProfilePage from "../pages/profile/ProfilePage";

const Router = () => {
  const token = localStorage.getItem("access_token");
  const role = localStorage.getItem("role");

  return (
    <BrowserRouter>
      {token && role === "admin" && (
        <AdminLayout>
          <Routes>
            <Route path="/login" element={<Login />} />
          </Routes>
        </AdminLayout>
      )}
      {token && role === "customer" && (
        <CustomerLayout>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/user" element={<ProfilePage />} />
          </Routes>
        </CustomerLayout>
      )}
      {!token && (
        <UserLayout>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<RegisterPage />} />
          </Routes>
        </UserLayout>
      )}
    </BrowserRouter>
  );
};

export default Router;
