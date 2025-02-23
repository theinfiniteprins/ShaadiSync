import { Outlet } from 'react-router-dom';
import ArtistNavbar from './../components/ArtistNavbar';
import AdminSidebar from './../components/AdminSidebar';

const AdminLayout = () => {
    return (
      <div className="w-full min-h-screen bg-gray-5 flex flex-col">
        <ArtistNavbar />

        <div className="flex w-full mt-22">
          <AdminSidebar />
          <main className="flex-1 p-6 bg-white ml-68 border border-gray-200 rounded-3xl shadow-md mt-10 mr-10 h-[85vh] overflow-y-scroll scrollbar-hide">
  <Outlet />
</main>



        </div>
      </div>
    );
  };
export default AdminLayout;
