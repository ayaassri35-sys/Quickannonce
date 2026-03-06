import "./Adard.css";

export default function AdCard({ annonce }) {
  return (
    <div className="col-md-4 mb-4">
      <div className="card ad-card h-100">
        <div className="position-relative">
          <img
            src={annonce.image || "/placeholder.svg"}
            className="card-img-top ad-img"
            alt={annonce.titre || "Annonce"}
            onError={(e) => {
              e.target.src = "/placeholder.svg";
            }}
          />

          {annonce.type && (
            <span className={`badge ad-badge ${annonce.type}`}>
              {annonce.type.toUpperCase()}
            </span>
          )}
        </div>
        <div className="card-body">
          <h5 className="card-title">
            {annonce.titre || "Sans titre"}
          </h5>

          <p className="price">
            {annonce.prix ? annonce.prix + " DH" : "Prix non défini"}
          </p>

          <p className="city">
            <i className="bi bi-geo-alt"></i>{" "}
            {annonce.ville || "Ville non précisée"}
          </p>
          {annonce.description && (
            <p className="card-text small text-muted">
              {annonce.description}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
