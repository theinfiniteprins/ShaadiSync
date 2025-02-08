import Navbar from "../components/NavBar";
// import Footer from "../components/Footer";

const UserLayout = ({ children }) => {
  return (
    <>
      <Navbar />
      <main className="container mx-auto bg-pink-100 min-h-screen">{children}</main>
      {/* <Footer /> */}
    </>
  );
};

export default UserLayout;
