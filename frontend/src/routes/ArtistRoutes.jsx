import { Routes, Route, Outlet } from "react-router-dom";
import ArtistLayout from "../layouts/ArtistLayout";
import Dashboard from "../pages/Artist/Dashboard";
// import SignUp from "../pages/Artist/SignUp";
import Login from "../pages/Artist/Login";
import Leads from "../pages/Artist/leads";
import LeadsByService from "../pages/Artist/leadsByService";
import Services from "../pages/Artist/services";


const ArtistRoutes = () => {
    return (
        <Routes>
            {/* Protected routes with UserLayout */}
            <Route element={<ArtistLayout />}>
               
                <Route path="/" element={<Dashboard />} />
                <Route path="/leads" element={<Leads />} />
                <Route path="/leads/:serviceId" element={<LeadsByService />} />
                <Route path="/services" element={<Services />} />

            </Route>


            {/* Auth routes without UserLayout */}
            {/* <Route path="/signup" element={<SignUp />} /> */}
            <Route path="/login" element={<Login />} />
        </Routes>
    );
};

export default ArtistRoutes;
