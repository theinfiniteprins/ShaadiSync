import { Routes, Route } from "react-router-dom";
import NotFound from "./pages/error/NotFound";
import UserRoutes from "./routes/UserRoutes";
import ArtistRoutes from "./routes/ArtistRoutes";
import AdminRoutes from "./routes/AdminRoutes";
export default function App() {
  return (

      <Routes>
      <Route path="/*" element={<UserRoutes />} />
      <Route path="/artist/*" element={<ArtistRoutes />} />
      <Route path="/admin/*" element={<AdminRoutes />} /> 
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
