import { useEffect } from "react";
import { Outlet } from 'react-router-dom';
import { useAuth } from "../context/AuthContext";
import Navbar from "../components/NavBar";
import config from "../configs/config";

const CHATBASE_SCRIPT_ID = "YB_HasA7Oi32Cf2-hA65q";

const UserLayout = () => {
  const { user } = useAuth();

  useEffect(() => {
    async function setupChatbase() {
      // Remove the user check for testing
      // if (!user) return;
      let userId = "guest";
      let hash = "";
      if (user) {
        const res = await fetch(`${config.baseUrl}/api/chatbase/hash`, { credentials: "include" });
        const data = await res.json();
        userId = data.userId;
        hash = data.hash;
      }
      if (!document.getElementById(CHATBASE_SCRIPT_ID)) {
        const script = document.createElement("script");
        script.src = "https://www.chatbase.co/embed.min.js";
        script.id = CHATBASE_SCRIPT_ID;
        script.domain = "www.chatbase.co";
        document.body.appendChild(script);

        script.onload = () => {
          if (window.chatbase && user) {
            window.chatbase('setUser', { id: userId, hash });
          }
        };
      } else {
        if (window.chatbase && user) {
          window.chatbase('setUser', { id: userId, hash });
        }
      }
    }
    setupChatbase();
  }, [user]);

  return (
    <div className="w-full min-h-screen bg-pink-25">
      <div className="fixed top-0 left-0 w-full z-50 bg-pink-100 shadow-md">
        <Navbar />
      </div>
      <main className="container mx-auto pt-16">
        <Outlet />
      </main>
      {/* No custom button, Chatbase default launcher will appear */}
    </div>
  );
};

export default UserLayout;
