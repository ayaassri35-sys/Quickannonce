import { createSelector } from "@reduxjs/toolkit";

const selectAnnoncesItems = (state) => state.annonces.items;
const selectAnnoncesFilters = (state) => state.annonces.filters;

export const selectFilteredAnnonces = createSelector(
  [selectAnnoncesItems, selectAnnoncesFilters],
  (items, filters) => {
    return items.filter(a => {
      // ✅ Ne montrer que les annonces acceptées
      if (a.etat !== "acceptee")
        return false;

      if (filters.motcle && !a.titre.toLowerCase().includes(filters.motcle.toLowerCase()))
        return false;

      if (filters.ville && a.ville.toLowerCase() !== filters.ville.toLowerCase())
        return false;

      if (filters.categorieId && a.categorieId !== Number(filters.categorieId))
        return false;

      if (filters.prixmin && a.prix < Number(filters.prixmin))
        return false;

      if (filters.prixmax && a.prix > Number(filters.prixmax))
        return false;

      return true;
    });
  }
);
