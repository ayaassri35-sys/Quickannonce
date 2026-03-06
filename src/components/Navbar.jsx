import { useState } from 'react';
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../features/auth/authSlice";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const dispatch = useDispatch();
  const { isAuthenticated, user } = useSelector(state => state.auth);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <nav className="navbar navbar-expand-lg px-4" style={{
      background: "white",
      boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
      padding: "10px 0"
    }}>
      <div className="container-fluid">
        <Link className="navbar-brand d-flex align-items-center" to="/" onClick={closeMenu}>
          <img 
            src="logo.png" 
            alt="QuickAnnonce" 
            style={{
              width: "120px", 
              height: "40px",
              marginRight: "10px",
              objectFit: "contain"
            }} 
          />
          <span style={{
            fontSize: "20px",
            fontWeight: "bold",
            color: "#2d3748"
          }}>QuickAnnonce</span>
        </Link>

        <button 
          className="navbar-toggler d-lg-none" 
          type="button" 
          onClick={toggleMenu}
          style={{
            border: "none",
            background: "none",
            fontSize: "24px",
            color: "#2d3748"
          }}
        >
          {isMenuOpen ? '✕' : '☰'}
        </button>

        <div className={`collapse navbar-collapse ${isMenuOpen ? 'show' : ''}`}>
          <div className="navbar-nav ms-auto align-items-center">
            <Link className="nav-link" to="/recherche" onClick={closeMenu}>
              <i className="bi bi-search me-1"></i>
              Recherche
            </Link>

            {!isAuthenticated && (
              <div className="d-flex flex-column flex-lg-row align-items-center mt-2 mt-lg-0">
                <Link className="btn me-2 mb-2 mb-lg-0" to="/connexion" onClick={closeMenu} style={{
                  backgroundColor: "#c4a590",
                  color: "white",
                  padding: "8px 16px",
                  borderRadius: "8px",
                  textDecoration: "none",
                  fontSize: "14px"
                }}>
                  <i className="bi bi-box-arrow-in-right me-1"></i>
                  Connexion
                </Link>
                <Link className="btn mb-2 mb-lg-0" to="/inscription" onClick={closeMenu} style={{
                  backgroundColor: "#e55a3a", 
                  color: "white", 
                  padding: "8px 16px",
                  borderRadius: "8px",
                  textDecoration: "none",
                  fontSize: "14px"
                }}>
                  <i className="bi bi-person-plus me-1"></i>
                  Inscription
                </Link>
              </div>
            )}

            {isAuthenticated && user && (
              <div className="d-flex flex-column flex-lg-row align-items-center mt-2 mt-lg-0">
                <Link className="nav-link mb-2 mb-lg-0" to="/publier" onClick={closeMenu}>
                  <i className="bi bi-plus-circle me-1"></i>
                  Publier
                </Link>
                <Link className="nav-link mb-2 mb-lg-0" to="/mes-annonces" onClick={closeMenu}>
                  <i className="bi bi-collection me-1"></i>
                  Mes annonces
                </Link>

                {user.role === "admin" && (
                  <Link className="nav-link text-primary fw-bold mb-2 mb-lg-0" to="/admin" onClick={closeMenu}>
                    <i className="bi bi-shield-check me-1"></i>
                    Admin
                  </Link>
                )}

                <button
                  className="btn btn-secondary ms-0 ms-lg-3 mt-2 mt-lg-0"
                  onClick={() => {
                    dispatch(logout());
                    closeMenu();
                  }}
                  style={{
                    padding: "8px 16px",
                    borderRadius: "8px",
                    fontSize: "14px"
                  }}
                >
                  <i className="bi bi-box-arrow-right me-1"></i>
                  Déconnexion
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
