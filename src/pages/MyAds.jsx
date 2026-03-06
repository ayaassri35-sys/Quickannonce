import { useSelector, useDispatch } from "react-redux";
import AdCard from "../components/AdCard";
import { deleteAnnonce } from "../features/annonces/annoncesSlice";

export default function MyAds() {
  const { user } = useSelector(state => state.auth);
  const allAnnonces = useSelector(state => state.annonces.items);
  const annonces = allAnnonces.filter(a => a.userId === user?.id);
  const dispatch = useDispatch();

  // Debug: afficher les informations
  console.log("=== DEBUG MES ANNONCES ===");
  console.log("Utilisateur connecté:", user);
  console.log("User ID:", user?.id);
  console.log("Toutes les annonces:", allAnnonces);
  console.log("Annonces filtrées pour cet utilisateur:", annonces);

  const handleDelete = (annonceId) => {
    console.log("Tentative de suppression de l'annonce:", annonceId);
    if (window.confirm("Êtes-vous sûr de vouloir supprimer cette annonce ?")) {
      dispatch(deleteAnnonce(annonceId));
      console.log("Suppression dispatchée");
    }
  };

  return (
    <div className="min-vh-100" style={{
      background: "linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)",
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      padding: "20px 0"
    }}>
      <div className="container">
        <div className="text-center mb-4">
          <div className="d-inline-flex align-items-center justify-content-center rounded-circle mb-3" style={{
            width: "80px",
            height: "80px",
            background: "#e55a3a",
            boxShadow: "0 4px 15px rgba(229, 90, 58, 0.3)"
          }}>
            <i className="bi bi-collection text-white fs-1"></i>
          </div>
          <h1 className="fw-bold mb-1" style={{color: "#2d3748"}}>Mes Annonces</h1>
          <p className="text-muted mb-0">Gérez toutes vos annonces publiées</p>
        </div>

        {annonces.length === 0 ? (
          <div className="text-center py-5">
            <div className="d-inline-flex align-items-center justify-content-center rounded-circle mb-3" style={{
              width: "100px",
              height: "100px",
              background: "#e9ecef",
              border: "2px dashed #dee2e6"
            }}>
              <i className="bi bi-inbox text-muted fs-1"></i>
            </div>
            <h3 className="text-muted">Aucune annonce publiée</h3>
            <p className="text-muted">Commencez par publier votre première annonce !</p>
            <a 
              href="/publier" 
              className="btn btn-primary mt-3"
              style={{
                backgroundColor: "#e55a3a",
                border: "none",
                borderRadius: "10px",
                padding: "10px 30px"
              }}
            >
              <i className="bi bi-plus-circle me-2"></i>
              Publier une annonce
            </a>
          </div>
        ) : (
          <div className="row">
            {annonces.map(a => (
              <div key={a.id} className="col-md-6 col-lg-4 mb-4">
                <div className="card shadow h-100 border-0" style={{
                  borderRadius: "15px",
                  overflow: "hidden",
                  position: "relative"
                }}>
                  <div className="position-relative">
                    <img
                      src={a.image || "/placeholder.svg"}
                      className="card-img-top"
                      style={{
                        height: "200px",
                        objectFit: "cover",
                        width: "100%"
                      }}
                      alt={a.titre || "Annonce"}
                      onError={(e) => {
                        e.target.src = "/placeholder.svg";
                      }}
                    />
                    
                    {/* Badge de statut */}
                    {a.etat && (
                      <span className={`position-absolute top-0 end-0 m-2 badge-custom ${
                        a.etat === 'acceptee' ? 'bg-success' : 
                        a.etat === 'refusee' ? 'bg-danger' : 'bg-warning'
                      }`} style={{
                        fontSize: "11px",
                        padding: "4px 8px",
                        borderRadius: "12px",
                        whiteSpace: "nowrap",
                        zIndex: 10,
                        boxShadow: "0 2px 4px rgba(0,0,0,0.1)"
                      }}>
                        {a.etat === 'acceptee' ? '✅ Acceptée' : 
                         a.etat === 'refusee' ? '❌ Refusée' : '⏳ En attente'}
                      </span>
                    )}
                  </div>
                  
                  <div className="card-body">
                    <h5 className="card-title fw-bold mb-2">{a.titre}</h5>
                    
                    <p className="price mb-2" style={{
                      fontSize: "18px",
                      fontWeight: "bold",
                      color: "#e55a3a"
                    }}>
                      {a.prix ? a.prix + " DH" : "Prix non défini"}
                    </p>
                    
                    <p className="city mb-3 text-muted" style={{
                      fontSize: "14px"
                    }}>
                      <i className="bi bi-geo-alt me-1"></i>
                      {a.ville || "Ville non précisée"}
                    </p>
                    
                    {a.description && (
                      <p className="card-text small text-muted mb-3">
                        {a.description.length > 100 ? a.description.substring(0, 100) + "..." : a.description}
                      </p>
                    )}
                  </div>
                  
                  <div className="card-footer bg-transparent border-0 p-3">
                    <div className="d-flex justify-content-between align-items-center">
                      <div className="text-muted small">
                        <i className="bi bi-calendar me-1"></i>
                        {new Date(a.datePoster).toLocaleDateString('fr-FR')}
                      </div>
                      
                      <button 
                        className="btn btn-danger btn-sm"
                        onClick={() => handleDelete(a.id)}
                        style={{
                          borderRadius: "20px",
                          padding: "5px 15px",
                          fontSize: "12px"
                        }}
                      >
                        <i className="bi bi-trash me-1"></i>
                        Supprimer
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
