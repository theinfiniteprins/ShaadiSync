import { FaUsers, FaHandshake, FaStar, FaEnvelope } from "react-icons/fa";
import logo from "../../assets/ShaadiSync.png";

export default function AboutUs() {
  return (
    <div className="bg-pink-50 text-gray-900">
      {/* Hero Section */}
      <div className="text-center py-16 bg-pink-100">
        <img src={logo} alt="ShaadiSync Logo" className="w-90 h-60 mx-auto mb-4" />
        <h1 className="text-4xl font-bold">About ShaadiSync</h1>
        <p className="text-lg mt-4 max-w-3xl mx-auto">
          Syncing your wedding journey with ease. Find verified wedding professionals effortlessly.
        </p>
      </div>

      {/* Our Mission */}
      <section className="py-12 text-center">
        <h2 className="text-3xl font-semibold">Our Mission</h2>
        <p className="text-gray-700 max-w-2xl mx-auto mt-4">
          We aim to simplify wedding planning by connecting couples with trusted vendors,
          providing seamless event management, and ensuring a stress-free experience.
        </p>
      </section>

      {/* Our Services */}
      <section className="py-12 bg-white">
        <h2 className="text-3xl font-semibold text-center">What We Offer</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8 max-w-5xl mx-auto">
          <div className="p-6 bg-pink-100 rounded-lg text-center">
            <FaUsers className="text-4xl text-pink-600 mx-auto" />
            <h3 className="text-xl font-semibold mt-4">Vendor Listings</h3>
            <p className="text-gray-700 mt-2">Browse and book top-rated wedding vendors.</p>
          </div>
          <div className="p-6 bg-pink-100 rounded-lg text-center">
            <FaHandshake className="text-4xl text-pink-600 mx-auto" />
            <h3 className="text-xl font-semibold mt-4">Personalized Planning</h3>
            <p className="text-gray-700 mt-2">Get tailored recommendations for your wedding.</p>
          </div>
          <div className="p-6 bg-pink-100 rounded-lg text-center">
            <FaStar className="text-4xl text-pink-600 mx-auto" />
            <h3 className="text-xl font-semibold mt-4">Exclusive Deals</h3>
            <p className="text-gray-700 mt-2">Unlock special offers and discounts.</p>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-12 text-center bg-pink-50">
        <h2 className="text-3xl font-semibold">What Our Clients Say</h2>
        <p className="text-gray-700 max-w-2xl mx-auto mt-4">
          Hear from couples who used ShaadiSync to make their dream wedding a reality.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8 max-w-4xl mx-auto">
          <div className="p-6 bg-white rounded-lg shadow">
            <p className="italic text-gray-700">"ShaadiSync made our wedding planning so easy! Highly recommend!"</p>
            <h4 className="mt-2 font-semibold">- Anjali & Raj</h4>
          </div>
          <div className="p-6 bg-white rounded-lg shadow">
            <p className="italic text-gray-700">"Found the perfect vendors within minutes. Best decision ever!"</p>
            <h4 className="mt-2 font-semibold">- Priya & Aman</h4>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-12 text-center">
        <h2 className="text-3xl font-semibold">Get in Touch</h2>
        <p className="text-gray-700 max-w-2xl mx-auto mt-4">
          Have questions? Our team is here to help! Reach out and start planning your dream wedding today.
        </p>
        <a
          href="/contact"
          className="inline-flex items-center px-6 py-3 mt-6 bg-pink-600 text-white font-semibold rounded-full hover:bg-pink-700 transition"
        >
          <FaEnvelope className="mr-2" /> Contact Us
        </a>
      </section>
    </div>
  );
}
