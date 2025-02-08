import { Outlet } from 'react-router-dom';
import Navbar from "../components/NavBar";
// import Footer from "../components/Footer";

const UserLayout = () => {
  return (
    <div>
      <Navbar />
      <main className="container mx-auto bg-pink-100 min-h-screen">
        <Outlet />
      </main>
      {/* <Footer /> */}
    </div>
  );
};

export default UserLayout;
