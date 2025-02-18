import { Routes, Route, Navigate, Outlet } from "react-router-dom";
import ArtistLayout from "../layouts/ArtistLayout";
import Dashboard from "../pages/Artist/Dashboard";
import Signup from "../pages/Artist/Signup";
import Login from "../pages/Artist/Login";
import Leads from "../pages/Artist/leads";
import LeadsByService from "../pages/Artist/leadsByService";
import Services from "../pages/Artist/Services";
import ViewService from "../pages/Artist/ViewService";
import Wallet from "../pages/Artist/Wallet";

// Private Route component
const PrivateRoute = () => {
    const artistToken = localStorage.getItem("artistToken");
    return artistToken ? <Outlet /> : <Navigate to="/artist/login" replace />;
};

const ArtistRoutes = () => {
    return (
        <Routes>
            {/* Protected Routes */}
            <Route element={<PrivateRoute />}>
                <Route element={<ArtistLayout />}>
                    <Route path="/" element={<Dashboard />} />
                    <Route path="/leads" element={<Leads />} />
                    <Route path="/leads/:serviceId" element={<LeadsByService />} />
                    <Route path="/services" element={<Services />} />
                    <Route path="/service/:id" element={<ViewService />} />
                    <Route path="/wallet" element={<Wallet />} />
                </Route>
            </Route>

            {/* Public Routes */}
            <Route path="/signup" element={<Signup />} />
            <Route path="/login" element={<Login />} />
        </Routes>
    );
};

export default ArtistRoutes;
