import { Route, Routes } from "react-router-dom";
import AmbientBackground from "./components/AmbientBackground.jsx";
import Navbar from "./components/Navbar.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import Home from "./pages/Home.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import FaceScan from "./pages/FaceScan.jsx";
import Footer from "./components/Footer";

export default function App() {
  return (
    <>
      <AmbientBackground />
      <Navbar />
      <main>
      
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/scan/skin" element={<FaceScan />} />
            {/* /scan/hair, /recommendations, /progress, /assistant land in
                the Hair Analysis, Recommendation Engine, Progress Tracker,
                and AI Assistant modules respectively. */}
          </Route>
        </Routes>
      </main>
      <Footer />
    </>
  );
}
