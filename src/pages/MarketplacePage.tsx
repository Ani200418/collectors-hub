import React, { useState, useEffect, useMemo, useRef } from 'react';
import SearchBar from '../components/common/SearchBar/SearchBar';
import FilterBar from '../components/common/FilterBar/FilterBar';
import { ViewMode } from '../types';
import MarketplaceCard from '../components/marketplace/MarketplaceCard';
import { CardSkeleton } from '../components/common/Skeleton/Skeleton';
import EmptyState from '../components/common/EmptyState/EmptyState';
import { CATEGORIES } from '../data/categories';
import { marketplaceItems } from '../data/marketplace';
import { useInfiniteScroll } from '../hooks/useInfiniteScroll';
import { useDebounce } from '../hooks/useDebounce';
import { simulateLoading } from '../utils/formatters';
import { SearchX } from 'lucide-react';
import { useCollection } from '../context/CollectionContext';
import { MarketplaceItem } from '../types';
import './MarketplacePage.css';

const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'name-asc', label: 'Name: A-Z' }
];

const CONDITIONS = ['Mint', 'Near Mint', 'Good', 'Fair'];

const ITEMS_PER_PAGE = 12;

const MarketplacePage: React.FC = () => {
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 300);
  const [category, setCategory] = useState('');
  const [condition, setCondition] = useState('');
  const [sort, setSort] = useState('newest');
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [isLoading, setIsLoading] = useState(true);
  const { addToCollection } = useCollection();

  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);
    simulateLoading(800).then(() => {
      if (isMounted) setIsLoading(false);
    });
    return () => { isMounted = false; };
  }, []);

  const filteredItems = useMemo(() => {
    let result = marketplaceItems.filter(item => {
      const matchSearch = item.title.toLowerCase().includes(debouncedSearch.toLowerCase());
      const matchCategory = category ? item.category === category : true;
      const matchCondition = condition ? item.condition === condition : true;
      return matchSearch && matchCategory && matchCondition;
    });

    switch (sort) {
      case 'price-asc':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'name-asc':
        result.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case 'newest':
      default:
        result.sort((a, b) => new Date(b.dateAdded).getTime() - new Date(a.dateAdded).getTime());
        break;
    }
    return result;
  }, [debouncedSearch, category, condition, sort]);

  const { visibleItems: displayedItems, hasMore, sentinelRef } = useInfiniteScroll(filteredItems, ITEMS_PER_PAGE);

  const handleAddToWishlist = (item: MarketplaceItem) => {
    addToCollection('wishlist', item);
  };

  const handleSearchChange = (value: string) => {
    setSearch(value);
  };

  return (
    <div className="marketplace-page">
      <header className="marketplace-page__header">
        <h1>Marketplace</h1>
        <p>Discover rare and unique collectibles</p>
      </header>

      <div className="marketplace-page__toolbar">
        <SearchBar
          value={search}
          onChange={handleSearchChange}
          placeholder="Search marketplace..."
        />
        <FilterBar
          categories={CATEGORIES}
          conditions={CONDITIONS}
          sortOptions={SORT_OPTIONS}
          selectedCategory={category}
          selectedCondition={condition}
          selectedSort={sort}
          viewMode={viewMode}
          onCategoryChange={(c) => { setCategory(c); }}
          onConditionChange={(c) => { setCondition(c); }}
          onSortChange={(s) => { setSort(s); }}
          onViewModeChange={setViewMode}
        />
      </div>

      <div className="marketplace-page__content">
        {isLoading ? (
          <div className={`marketplace-grid marketplace-grid--${viewMode}`}>
            {Array.from({ length: 8 }).map((_, i) => (
              <CardSkeleton key={i} />
            ))}
          </div>
        ) : filteredItems.length === 0 ? (
          <EmptyState
            icon={SearchX}
            title="No items found"
            description="Try adjusting your filters or search term to find what you're looking for."
            actionLabel="Clear Filters"
            onAction={() => {
              setSearch('');
              setCategory('');
              setCondition('');
            }}
          />
        ) : (
          <div className={`marketplace-grid marketplace-grid--${viewMode}`}>
            {displayedItems.map((item) => (
              <MarketplaceCard
                key={item.id}
                item={item}
                viewMode={viewMode}
                onAddToWishlist={handleAddToWishlist}
              />
            ))}
          </div>
        )}
        {!isLoading && displayedItems.length < filteredItems.length && (
          <div ref={sentinelRef} className="marketplace-page__sentinel">
            <CardSkeleton />
          </div>
        )}
      </div>
    </div>
  );
};

export default MarketplacePage;
