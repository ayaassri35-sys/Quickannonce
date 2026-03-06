import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import { useTokenRefresh } from "./hooks/useTokenRefresh";

import Home from "./pages/Home";
import Search from "./pages/Search";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Publish from "./pages/Publish";
import MyAds from "./pages/MyAds";
import Admin from "./pages/Admin";
import AdDetail from "./pages/AdDetail";

export default function App() {
  // Activer le rafraîchissement automatique des tokens
  useTokenRefresh();

  return (
    <>
      <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/recherche" element={<Search />} />
        <Route path="/inscription" element={<Register />} />
        <Route path="/connexion" element={<Login />} />
        <Route path="/annonce/:id" element={<AdDetail />} />
        
        {/* Routes protégées */}
        <Route path="/publier" element={
          <ProtectedRoute>
            <Publish />
          </ProtectedRoute>
        } />
        
        <Route path="/mes-annonces" element={
          <ProtectedRoute>
            <MyAds />
          </ProtectedRoute>
        } />
        
        <Route path="/admin" element={
          <ProtectedRoute requiredRole="admin">
            <Admin />
          </ProtectedRoute>
        } />
      </Routes>
    </>
  );
}
