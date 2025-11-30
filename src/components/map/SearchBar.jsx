import { Search, SlidersHorizontal } from 'lucide-react';

const SearchBar = ({ onSearchChange, onFilterClick, searchValue = '' }) => {

  return (
    <div className="w-full bg-text-secondary px-4 py-3 flex items-center gap-2">
      <div className="flex-1 flex items-center gap-2 bg-text-dark rounded-lg px-4 py-3">
        <Search className="w-5 h-5 text-primary-white" />
        <input
          type="text"
          placeholder="Encuentra un parqueadero"
          value={searchValue}
          onChange={(e) => onSearchChange(e.target.value)}
          className="flex-1 bg-transparent text-primary-white placeholder-primary-white outline-none text-sm"
        />
      </div>
      <button
        onClick={onFilterClick}
        className="bg-text-dark rounded-lg p-3 hover:bg-opacity-80 transition-colors"
        aria-label="Abrir filtros"
      >
        <SlidersHorizontal className="w-5 h-5 text-primary-white" />
      </button>
    </div>
  );
};

export default SearchBar;