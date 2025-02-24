import { Routes, Route, Outlet } from "react-router-dom";
import AdminLayout from "../layouts/AdminLayout";
import Dashboard from "../pages/Admin/Dashboard";
import AllUsers from "../pages/Admin/AllUsers";
import AllArtists from "../pages/Admin/AllArtists";
import UserTransactionHistory from "../pages/Admin/UserTransactions";



const AdminRoutes = () => {
    return (
        <Routes>
            <Route element={<AdminLayout />}>
               
                <Route path="/" element={<Dashboard />} />
                <Route path="/users" element={<AllUsers />} />
                <Route path="/artists" element={<AllArtists />} />
                <Route path="/user-transactions" element={<UserTransactionHistory />} />
               
            </Route>
        </Routes>
    );
};

export default AdminRoutes;
