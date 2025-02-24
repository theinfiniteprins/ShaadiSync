import { Routes, Route, Outlet } from "react-router-dom";
import AdminLayout from "../layouts/AdminLayout";
import Dashboard from "../pages/Admin/Dashboard";
import AllUsers from "../pages/Admin/AllUsers";
import AllArtists from "../pages/Admin/AllArtists";
import Services from "../pages/Admin/Services";
//import SignUp from "../pages/Admin/SignUp";
//import Login from "../pages/Admin/Login";
//import Leads from "../pages/Admin/leads";




const AdminRoutes = () => {
    return (
        <Routes>
            {/* Protected routes with UserLayout */}
            <Route element={<AdminLayout />}>
               
                <Route path="/" element={<Dashboard />} />
                <Route path="/users" element={<AllUsers />} />
                <Route path="/artists" element={<AllArtists />} />
                <Route path="/services" element={<Services />} />
               
            </Route>


            {/* Auth routes without UserLayout */}
            {/* <Route path="/signup" element={<SignUp />} /> */}
            {/* <Route path="/login" element={<Login />} /> */}
        </Routes>
    );
};

export default AdminRoutes;
