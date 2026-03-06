import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";

export default function AdDetail() {
  const { id } = useParams();
  const annonce = useSelector(state =>
    state.annonces.items.find(a => a.id === id)
  );

  if (!annonce) return <p>Annonce introuvable</p>;

  return (
    <div className="container mt-4">
      <h2>{annonce.titre}</h2>
      <p>{annonce.description}</p>
      <p><strong>{annonce.prix} DH</strong></p>
      <p>{annonce.ville}</p>
    </div>
  );
}
