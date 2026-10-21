
import { useEffect, useState } from "react";
import NovaChatbot from "./components/NovaChatbot";
import { Route, Routes } from "react-router-dom";

import AmbientBackground from "./components/AmbientBackground.jsx";
import Navbar from "./components/Navbar.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";

import Home from "./pages/Home.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import FaceScan from "./pages/FaceScan.jsx";
import ProductRecommendations from "./pages/ProductRecommendations";
import SavedProducts from "./pages/SavedProducts";
import HairCare from "./pages/HairCare.jsx";

import Footer from "./components/Footer";
import WebLoader from "./components/WebLoader";
import SavedScans from "./pages/SavedScans";
import SavedScanReport from "./pages/SavedScanReport";

export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [loaderExit, setLoaderExit] = useState(false);

  useEffect(() => {
    const showTimer = setTimeout(() => {
      setLoaderExit(true);
    }, 1800);

    const removeTimer = setTimeout(() => {
      setIsLoading(false);
    }, 2600);

    return () => {
      clearTimeout(showTimer);
      clearTimeout(removeTimer);
    };
  }, []);

  return (
    <>
      {isLoading && (
        <WebLoader exiting={loaderExit} />
      )}

      <div className={isLoading ? "app-hidden" : "app-visible"}>

        <AmbientBackground />

        <Navbar />

        <main>
          <Routes>

            <Route
              path="/"
              element={<Home />}
            />

            <Route
              path="/login"
              element={<Login />}
            />

            <Route
              path="/register"
              element={<Register />}
            />

            <Route element={<ProtectedRoute />}>

              <Route
                path="/dashboard"
                element={<Dashboard />}
              />
               <Route
  path="/saved-scans"
  element={<SavedScans />}
/>

<Route
  path="/saved-scans/:reportId"
  element={<SavedScanReport />}
/>

              <Route
                path="/scan/skin"
                element={<FaceScan />}
              />
              <Route
  path="/recommendations/:analysisId"
  element={<ProductRecommendations />}

/>
              <Route
  path="/saved-products"
  element={<SavedProducts />}
/>
            </Route>
            <Route
  path="/hair-care"
  element={<HairCare />}
/>

          </Routes>
        </main>

        <Footer />
         {!isLoading && <NovaChatbot />}

      </div>
      
    </>
  );
}