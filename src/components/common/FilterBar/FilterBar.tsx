import React from 'react';
import { LayoutGrid, List, ChevronDown } from 'lucide-react';
import './FilterBar.css';

export interface SortOption {
  value: string;
  label: string;
}

interface FilterBarProps {
  categories: string[];
  conditions?: string[];
  selectedCategory: string;
  selectedCondition?: string;
  sortOptions: SortOption[];
  selectedSort: string;
  onCategoryChange: (category: string) => void;
  onConditionChange?: (condition: string) => void;
  onSortChange: (sort: string) => void;
  viewMode?: 'grid' | 'list';
  onViewModeChange?: (mode: 'grid' | 'list') => void;
  resultCount?: number;
}

const FilterBar: React.FC<FilterBarProps> = ({
  categories,
  conditions,
  selectedCategory,
  selectedCondition,
  sortOptions,
  selectedSort,
  onCategoryChange,
  onConditionChange,
  onSortChange,
  viewMode,
  onViewModeChange,
  resultCount
}) => {
  return (
    <div className="filter-bar">
      <div className="filter-bar__categories">
        {['All Categories', ...categories].map((category) => (
          <button
            key={category}
            className={`filter-bar__chip ${selectedCategory === category ? 'filter-bar__chip--active' : ''}`}
            onClick={() => onCategoryChange(category)}
          >
            {category}
          </button>
        ))}
      </div>
      
      <div className="filter-bar__controls">
        {resultCount !== undefined && (
          <span className="filter-bar__results">{resultCount} results</span>
        )}
        
        {conditions && onConditionChange && (
          <div className="filter-bar__select-wrapper">
            <select 
              value={selectedCondition || ''} 
              onChange={(e) => onConditionChange(e.target.value)}
              className="filter-bar__select"
            >
              <option value="">All Conditions</option>
              {conditions.map((cond) => (
                <option key={cond} value={cond}>{cond}</option>
              ))}
            </select>
            <ChevronDown className="filter-bar__select-icon" size={16} />
          </div>
        )}

        <div className="filter-bar__select-wrapper">
          <select 
            value={selectedSort} 
            onChange={(e) => onSortChange(e.target.value)}
            className="filter-bar__select"
          >
            {sortOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
          <ChevronDown className="filter-bar__select-icon" size={16} />
        </div>

        {viewMode && onViewModeChange && (
          <div className="filter-bar__view-toggle">
            <button 
              className={`filter-bar__view-btn ${viewMode === 'grid' ? 'filter-bar__view-btn--active' : ''}`}
              onClick={() => onViewModeChange('grid')}
              aria-label="Grid view"
            >
              <LayoutGrid size={18} />
            </button>
            <button 
              className={`filter-bar__view-btn ${viewMode === 'list' ? 'filter-bar__view-btn--active' : ''}`}
              onClick={() => onViewModeChange('list')}
              aria-label="List view"
            >
              <List size={18} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default FilterBar;
