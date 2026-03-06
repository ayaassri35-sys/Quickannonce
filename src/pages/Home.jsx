import { useSelector } from "react-redux";
import AdCard from "../components/AdCard";
import { selectFilteredAnnonces } from "../features/annonces/annoncesSelectors";

export default function Home() {
  const annonces = useSelector(selectFilteredAnnonces);

  return (
    <div className="container mt-4">
      <h2>Annonces récentes</h2>

      <div className="row mt-3">
        {annonces.length === 0 && (
          <p>Aucune annonce trouvée</p>
        )}

        {annonces.map(a => (
          <AdCard key={a.id} annonce={a} />
        ))}
      </div>
    </div>
  );
}
