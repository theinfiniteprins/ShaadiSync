import { Routes, Route, Outlet } from "react-router-dom";
import AdminLayout from "../layouts/AdminLayout";
import Dashboard from "../pages/Admin/Dashboard";
import AllUsers from "../pages/Admin/AllUsers";
import AllArtists from "../pages/Admin/AllArtists";
import UserTransactionHistory from "../pages/Admin/UserTransactions";
import Services from "../pages/Admin/AllServices";
import ArtistTransaction from "../pages/Admin/ArtistTransactions";


const AdminRoutes = () => {
    return (
        <Routes>
            <Route element={<AdminLayout />}>
               
                <Route path="/" element={<Dashboard />} />
                <Route path="/users" element={<AllUsers />} />
                <Route path="/artists" element={<AllArtists />} />
                <Route path="/services" element={<Services />} />
                <Route path="/user-transactions" element={<UserTransactionHistory />} />
                <Route path="/artist-transactions" element = {<ArtistTransaction />} />
                
            </Route>
        </Routes>
    );
};

export default AdminRoutes;
