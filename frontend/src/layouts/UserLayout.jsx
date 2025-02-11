import { Outlet } from 'react-router-dom';
import Navbar from "../components/NavBar";

const UserLayout = () => {
  return (
    <div className="w-full min-h-screen bg-pink-25">
      <div className="fixed top-0 left-0 w-full z-50 bg-pink-100 shadow-md">
        <Navbar />
      </div>
      <main className="container mx-auto pt-16">
        <Outlet />
      </main>
    </div>
  );
};

export default UserLayout;
