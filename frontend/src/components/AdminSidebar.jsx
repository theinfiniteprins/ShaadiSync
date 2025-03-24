import { Link, useNavigate } from "react-router-dom";

const AdminSidebar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Clear admin token and other admin-related data
    localStorage.removeItem('token');
    navigate('/');
  };

  return (
    <aside className="w-64 bg-white fixed rounded-lg p-6 flex flex-col m-4">
      <ul className="space-y-4 shadow-md p-4 rounded-3xl border border-gray-200">
        <li className="p-2 rounded-md cursor-pointer flex items-center">
           <Link to="/admin">Home</Link>
        </li>
        <li className="p-2 rounded-md cursor-pointer flex items-center">
           <Link to="/admin/users">Users</Link>
        </li>
        <li className="p-2 rounded-md cursor-pointer flex items-center">
           <Link to="/admin/artists">Artists</Link>
        </li>
        <li className="p-2 rounded-md cursor-pointer flex items-center">
           <Link to="/admin/services">Services</Link>
        </li>
        <li className="p-2 rounded-md cursor-pointer flex items-center">
           <Link to="/admin/user-transactions">User Transactions</Link>
        </li>
        <li className="p-2 rounded-md cursor-pointer flex items-center">
           <Link to="/admin/artist-transactions">Artist Transactions</Link>
        </li>
        <li className="p-2 rounded-md cursor-pointer flex items-center">
          <button 
            onClick={handleLogout}
            className="flex items-center gap-2 w-full"
          >
            <span>Logout</span>
          </button>
        </li>
      </ul>
    </aside>
  );
};

export default AdminSidebar;
