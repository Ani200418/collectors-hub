import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Package, Heart, Tag, TrendingUp } from 'lucide-react';
import { CollectionType, ViewMode } from '../types';
import { useCollection } from '../context/CollectionContext';
import { useDebounce } from '../hooks/useDebounce';
import { formatPrice } from '../utils/formatters';
import { CATEGORIES } from '../data/categories';

import CollectionTabs from '../components/collection/CollectionTabs';
import CollectionCard from '../components/collection/CollectionCard';
import SearchBar from '../components/common/SearchBar/SearchBar';
import FilterBar from '../components/common/FilterBar/FilterBar';
import EmptyState from '../components/common/EmptyState/EmptyState';

import './CollectionPage.css';

const SORT_OPTIONS = [
  { value: 'newest', label: 'Recently Added' },
  { value: 'oldest', label: 'Oldest First' },
  { value: 'value-desc', label: 'Highest Value' },
  { value: 'value-asc', label: 'Lowest Value' },
  { value: 'name-asc', label: 'Name: A-Z' },
  { value: 'name-desc', label: 'Name: Z-A' },
];

const CollectionPage: React.FC = () => {
  const navigate = useNavigate();
  const { collections, removeFromCollection, moveItem, getTotalValue } = useCollection();
  
  const [activeTab, setActiveTab] = useState<CollectionType>('owned');
  const [searchQuery, setSearchQuery] = useState('');
  const [category, setCategory] = useState('');
  const [sort, setSort] = useState('newest');
  const [viewMode, setViewMode] = useState<ViewMode>('grid');

  const debouncedSearch = useDebounce(searchQuery, 300);

  const activeItems = collections[activeTab] || [];
  
  const counts = {
    owned: collections.owned?.length || 0,
    wishlist: collections.wishlist?.length || 0,
    selling: collections.selling?.length || 0,
  };

  const filteredItems = useMemo(() => {
    let result = [...activeItems];
    
    // Search
    if (debouncedSearch) {
      const lowerSearch = debouncedSearch.toLowerCase();
      result = result.filter(item => item.title.toLowerCase().includes(lowerSearch));
    }
    
    // Filter
    if (category) {
      result = result.filter(item => item.category === category);
    }
    
    // Sort
    result.sort((a, b) => {
      switch (sort) {
        case 'newest': return new Date(b.dateAdded).getTime() - new Date(a.dateAdded).getTime();
        case 'oldest': return new Date(a.dateAdded).getTime() - new Date(b.dateAdded).getTime();
        case 'value-desc': return b.estimatedValue - a.estimatedValue;
        case 'value-asc': return a.estimatedValue - b.estimatedValue;
        case 'name-asc': return a.title.localeCompare(b.title);
        case 'name-desc': return b.title.localeCompare(a.title);
        default: return 0;
      }
    });
    
    return result;
  }, [activeItems, debouncedSearch, category, sort]);

  const totalValue = getTotalValue(activeTab);

  const getEmptyState = () => {
    switch (activeTab) {
      case 'owned':
        return (
          <EmptyState 
            icon={Package} 
            title="No items owned yet" 
            description="Start building your collection today."
            actionLabel="Browse Marketplace"
            onAction={() => navigate('/')}
          />
        );
      case 'wishlist':
        return (
          <EmptyState 
            icon={Heart} 
            title="Your wishlist is empty" 
            description="Save items you're interested in for later."
            actionLabel="Explore Items"
            onAction={() => navigate('/')}
          />
        );
      case 'selling':
        return (
          <EmptyState 
            icon={Tag} 
            title="Nothing listed for sale" 
            description="Ready to part with some items? List them here."
            actionLabel="List an Item"
            onAction={() => navigate('/')}
          />
        );
      default: return null;
    }
  };

  return (
    <div className="collection-page">
      <header className="collection-page__header">
        <h1 className="collection-page__title">My Collection</h1>
      </header>

      <CollectionTabs 
        activeTab={activeTab} 
        onTabChange={setActiveTab} 
        counts={counts} 
      />

      <div className="collection-page__stats">
        <div className="stat-card">
          <Package className="stat-card__icon" />
          <div className="stat-card__info">
            <span className="stat-card__value">{counts[activeTab]}</span>
            <span className="stat-card__label">Total Items</span>
          </div>
        </div>
        <div className="stat-card">
          <TrendingUp className="stat-card__icon" />
          <div className="stat-card__info">
            <span className="stat-card__value">{formatPrice(totalValue)}</span>
            <span className="stat-card__label">Estimated Value</span>
          </div>
        </div>
      </div>

      <div className="collection-page__controls">
        <SearchBar 
          value={searchQuery} 
          onChange={setSearchQuery} 
          placeholder="Search items..." 
        />
        <FilterBar 
          categories={CATEGORIES}
          selectedCategory={category}
          onCategoryChange={setCategory}
          sortOptions={SORT_OPTIONS}
          selectedSort={sort}
          onSortChange={setSort}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
        />
      </div>

      {filteredItems.length > 0 ? (
        <div className={`collection-page__grid collection-page__grid--${viewMode}`}>
          {filteredItems.map(item => (
            <CollectionCard
              key={item.id}
              item={item}
              collection={activeTab}
              viewMode={viewMode}
              onRemove={(id) => removeFromCollection(activeTab, id)}
              onMove={(id, to) => moveItem(activeTab, to, id)}
            />
          ))}
        </div>
      ) : (
        <div className="collection-page__empty">
          {getEmptyState()}
        </div>
      )}
    </div>
  );
};

export default CollectionPage;
