import Logo from '../assets/ShaadiSync.png';

const ArtistNavbar = () => {
    return (
        <nav className="w-full h-22 fixed bg-white shadow-md flex items-center px-6">
            <img 
                src={Logo} 
                alt="Logo" 
                className="h-60 w-auto"
            />
        </nav>
    );
};
  
export default ArtistNavbar;
  