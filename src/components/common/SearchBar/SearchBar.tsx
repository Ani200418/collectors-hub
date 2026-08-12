import React from 'react';
import { Search, X } from 'lucide-react';
import './SearchBar.css';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

const SearchBar: React.FC<SearchBarProps> = ({ value, onChange, placeholder = 'Search...', className = '' }) => {
  return (
    <div className={`search-bar ${className}`}>
      <Search className="search-bar__icon search-bar__icon--left" size={18} />
      <input
        type="text"
        className="search-bar__input"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
      />
      {value && (
        <button 
          className="search-bar__clear" 
          onClick={() => onChange('')}
          aria-label="Clear search"
        >
          <X size={16} />
        </button>
      )}
    </div>
  );
};

export default SearchBar;
