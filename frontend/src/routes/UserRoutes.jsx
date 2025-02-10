import { Routes, Route, Outlet } from "react-router-dom";
import UserLayout from "../layouts/UserLayout";
import Dashboard from "../pages/User/Dashboard";
import SignUp from "../pages/User/SignUp";
import Login from "../pages/User/Login";
import CategorywiseServiceList from "../pages/User/CategorywiseServiceList";
import Search from "../pages/User/Search";
import Profile from "../pages/User/Profile";




const UserRoutes = () => {
    return (
        <Routes>
            {/* Protected routes with UserLayout */}
            <Route element={<UserLayout />}>
                <Route path="/" element={<Dashboard />} />
                <Route path="/category/:categoryId" element={<CategorywiseServiceList />} />
                <Route path="/search/" element={<Search />} />
                <Route path="/profile/" element={<Profile />} />
            </Route>


            {/* Auth routes without UserLayout */}
            <Route path="/signup" element={<SignUp />} />
            <Route path="/login" element={<Login />} />
        </Routes>
    );
};

export default UserRoutes;
