export function Filters() {
  return (
    <div className="bg-white rounded-xl p-6 shadow-sm">
      <h2 className="text-xl font-bold text-[#101722] mb-6">FILTRES</h2>

      <div className="space-y-6">
        <div>
          <h3 className="font-semibold text-slate-800 mb-3">Catégorie</h3>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="category"
              defaultChecked
              className="w-4 h-4 text-[#0055A4] accent-[#0055A4]"
            />
            <span className="text-slate-700">IT & Numérique</span>
          </label>
        </div>

        <div>
          <h3 className="font-semibold text-slate-800 mb-3">Localisation</h3>
          <input
            type="text"
            placeholder="Ville, région..."
            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:border-[#0055A4] focus:outline-none text-sm"
          />
        </div>

        <div>
          <h3 className="font-semibold text-slate-800 mb-3">Types Techniques</h3>
          <div className="space-y-2">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="type"
                defaultChecked
                className="w-4 h-4 text-[#0ea5e9] accent-[#0ea5e9]"
              />
              <span className="text-slate-700 text-sm">Tous</span>
            </label>
          </div>
        </div>

        <div>
          <h3 className="font-semibold text-slate-800 mb-3">Type de Formation</h3>
          <select className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:border-[#0055A4] focus:outline-none text-sm">
            <option>Tous</option>
            <option>En ligne</option>
            <option>Présentiel</option>
            <option>Hybride</option>
          </select>
        </div>

        <div>
          <h3 className="font-semibold text-slate-800 mb-3">Prix</h3>
          <select className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:border-[#0055A4] focus:outline-none text-sm">
            <option>Tous</option>
            <option>Gratuit</option>
            <option>Payant</option>
          </select>
        </div>

        <div>
          <h3 className="font-semibold text-slate-800 mb-3">Durée</h3>
          <select className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:border-[#0055A4] focus:outline-none text-sm">
            <option>Toutes</option>
            <option>Moins de 3 mois</option>
            <option>3 à 6 mois</option>
            <option>Plus de 6 mois</option>
          </select>
        </div>

        <div>
          <h3 className="font-semibold text-slate-800 mb-3">Date de début</h3>
          <input
            type="date"
            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:border-[#0055A4] focus:outline-none text-sm"
          />
        </div>

        <div>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              className="w-4 h-4 text-[#0055A4] rounded accent-[#0055A4]"
            />
            <span className="text-slate-700 text-sm">Gratuit</span>
          </label>
        </div>

        <button className="w-full bg-[#F58220] hover:bg-[#e67418] text-white py-3 rounded-lg font-medium transition-colors">
          Appliquer les filtres
        </button>
      </div>
    </div>
  );
}
