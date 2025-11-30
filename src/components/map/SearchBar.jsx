import { Search, SlidersHorizontal } from 'lucide-react';

const SearchBar = ({ onSearchChange, onFilterClick, searchValue = '' }) => {

  return (
    <div className="w-full bg-gray-100 px-4 py-3 flex items-center gap-2">
      <div className="flex-1 flex items-center gap-2 bg-white border border-gray-200 rounded-lg px-4 py-3 shadow-sm">
        <Search className="w-5 h-5 text-gray-500" />
        <input
          type="text"
          placeholder="Encuentra un parqueadero"
          value={searchValue}
          onChange={(e) => onSearchChange(e.target.value)}
          className="flex-1 bg-transparent text-gray-900 placeholder-gray-500 outline-none text-sm"
        />
      </div>
      <button
        onClick={onFilterClick}
        className="bg-primary-600 rounded-lg p-3 hover:bg-primary-700 transition-colors shadow-sm"
        aria-label="Abrir filtros"
      >
        <SlidersHorizontal className="w-5 h-5 text-white" />
      </button>
    </div>
  );
};

export default SearchBar;