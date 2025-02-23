import { Link } from "react-router-dom";

const ArtistSidebar = () => {
  return (
    <aside className="w-64 bg-white fixed ounded-lg p-6 flex flex-col m-4">
      <ul className="space-y-4 shadow-md p-4 rounded-3xl border border-gray-200 ">
        <li className="p-2 rounded-md cursor-pointer flex items-center">
           <Link to="/artist">Dashboard</Link>
        </li>
        <li className="p-2 rounded-md cursor-pointer flex items-center">
           <Link to="/artist/services">Services</Link>
        </li>
        <li className="p-2 rounded-md cursor-pointer flex items-center">
           <Link to="/artist/leads">Leads</Link>
        </li>
        <li className="p-2 rounded-md cursor-pointer flex items-center">
           <Link to="/artist/wallet">Wallet</Link>
        </li>
        <li className="p-2 rounded-md cursor-pointer flex items-center">
           <Link to="/artist/profile">Profile</Link>
        </li>
        <li className="p-2 rounded-md cursor-pointer flex items-center">
            <Link to="/artist/more">Other</Link>
        </li>
      </ul>
    </aside>
  );
};

export default ArtistSidebar;
