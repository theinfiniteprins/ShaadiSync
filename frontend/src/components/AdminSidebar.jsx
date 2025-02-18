import { Link } from "react-router-dom";

const AdminSidebar = () => {
  return (
    <aside className="w-64 bg-white fixed ounded-lg p-6 flex flex-col m-4">
      <ul className="space-y-4 shadow-md p-4 rounded-3xl border border-gray-200 ">
        <li className="p-2 rounded-md cursor-pointer flex items-center">
           <Link to="/admin">Home</Link>
        </li>
        <li className="p-2 rounded-md cursor-pointer flex items-center">
           <Link to="/admin/user">Users</Link>
        </li>
        <li className="p-2 rounded-md cursor-pointer flex items-center">
           <Link to="/admin/artist">Artists</Link>
        </li>
        <li className="p-2 rounded-md cursor-pointer flex items-center">
           <Link to="/admin/service">Services</Link>
        </li>
      </ul>
    </aside>
  );
};

export default AdminSidebar;
