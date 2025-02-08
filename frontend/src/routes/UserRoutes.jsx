import { Routes, Route } from "react-router-dom";
import UserLayout from "../layouts/UserLayout";
import Dashboard from "../pages/User/Dashboard";

const UserRoutes = () => {
    return (
        <UserLayout>
            <Routes>
                <Route path="/" element={<Dashboard />} />
            </Routes>
        </UserLayout>

    );
};

export default UserRoutes;
