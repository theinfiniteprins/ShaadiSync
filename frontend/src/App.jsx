import { Routes, Route } from "react-router-dom";
import NotFound from "./pages/error/NotFound";
import UserRoutes from "./routes/UserRoutes";
import ArtistRoutes from "./routes/ArtistRoutes";
import AdminRoutes from "./routes/AdminRoutes";
import { Toaster } from 'react-hot-toast';
import { GoogleOAuthProvider } from '@react-oauth/google';

export default function App() {
  return (
    <>
      <Toaster 
        position="top-right"
        toastOptions={{
          className: 'react-hot-toast',
        }}
      />
        <GoogleOAuthProvider clientId="375875206731-olvrigjji28e0vhmcvdbn1d44c76i30s.apps.googleusercontent.com">
      <Routes>
        <Route path="/*" element={<UserRoutes />} />
        <Route path="/artist/*" element={<ArtistRoutes />} />
        <Route path="/admin/*" element={<AdminRoutes />} /> 
        <Route path="*" element={<NotFound />} />
      </Routes>
      </GoogleOAuthProvider>
    </>
  );
}
