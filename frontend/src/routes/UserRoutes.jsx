import { Routes, Route, Outlet } from "react-router-dom";
import UserLayout from "../layouts/UserLayout";
import Dashboard from "../pages/User/Dashboard";
import SignUp from "../pages/User/SignUp";
import Login from "../pages/User/Login";
import CategorywiseServiceList from "../pages/User/CategorywiseServiceList";
import Search from "../pages/User/Search";
import Profile from "../pages/User/Profile";
import AboutUs from "../pages/User/AboutUs";
import Terms from "../pages/User/Terms&Condition";
import Privacy from "../pages/User/PrivacyPolicy";
import ViewService from "../pages/User/ViewService";
import Wallet from "../pages/User/Wallet";
import UnlockedService from "../pages/User/UnlockedService";
import ArtistDetails from "../pages/User/ArtistDetails";




const UserRoutes = () => {
    return (
        <Routes>
            {/* Protected routes with UserLayout */}
            <Route element={<UserLayout />}>
                <Route path='/AboutUs' element={<AboutUs />}/>
                <Route path='/Terms&Condition' element={<Terms />}/>
                <Route path='/PrivacyPolicy' element={<Privacy />}/>
                <Route path="/services/:id" element={<ViewService />} />
                <Route path="/unlocked-services" element={<UnlockedService />} />
                <Route path="/artist-page/:artistId" element={<ArtistDetails />} />
                <Route path="/" element={<Dashboard />} />
                
                <Route path="/:categoryId/" element={<CategorywiseServiceList />} />
                {/* Route with location */}
                <Route path="/:categoryId/:location" element={<CategorywiseServiceList />} />
                <Route path="/search/" element={<Search />} />
                <Route path="/profile/" element={<Profile />} />
                <Route path="/wallet/" element={<Wallet />} />
            </Route>


            {/* Auth routes without UserLayout */}
            <Route path="/signup" element={<SignUp />} />
            <Route path="/login" element={<Login />} />
        </Routes>
    );
};

export default UserRoutes;
