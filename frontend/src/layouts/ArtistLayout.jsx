import { Outlet } from 'react-router-dom';
import ArtistNavbar from './../components/ArtistNavbar';
import Sidebar from './../components/Sidebar';

const ArtistLayout = () => {
    return (
        <div className="w-full min-h-screen flex flex-col">
            <ArtistNavbar />

            <div className="flex w-full mt-22">
                <Sidebar />
                <main className="flex-1 p-6 bg-white ml-68 border border-gray-200 rounded-3xl shadow-md mt-10 mr-10 h-[83vh] overflow-y-scroll scrollbar-hide">
                    <div className="overflow-auto" style={{
                        msOverflowStyle: 'none',
                        scrollbarWidth: 'none',
                        WebkitOverflowScrolling: 'touch',
                    }}>
                        <style>
                            {`
                                ::-webkit-scrollbar {
                                    display: none;
                                }
                                * {
                                    -ms-overflow-style: none;
                                    scrollbar-width: none;
                                }
                            `}
                        </style>
                        <Outlet />
                    </div>
                </main>
            </div>
        </div>
    );
};

export default ArtistLayout;
