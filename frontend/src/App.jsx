import { Routes, Route } from "react-router-dom";
import NotFound from "./pages/error/NotFound";
import UserRoutes from "./routes/UserRoutes";
import ArtistRoutes from "./routes/ArtistRoutes";
import AdminRoutes from "./routes/AdminRoutes";
import { Toaster } from 'react-hot-toast';

export default function App() {
  return (
    <>
      <Toaster 
        position="top-right"
        toastOptions={{
          className: 'react-hot-toast',
        }}
      />
      <Routes>
        <Route path="/*" element={<UserRoutes />} />
        <Route path="/artist/*" element={<ArtistRoutes />} />
        <Route path="/admin/*" element={<AdminRoutes />} /> 
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}
