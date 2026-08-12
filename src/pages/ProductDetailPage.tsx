import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, MapPin, SearchX, Check } from 'lucide-react';
import { marketplaceItems } from '../data/marketplace';
import LazyImage from '../components/common/LazyImage/LazyImage';
import Badge from '../components/common/Badge/Badge';
import EmptyState from '../components/common/EmptyState/EmptyState';
import { DetailSkeleton } from '../components/common/Skeleton/Skeleton'; 
import MarketplaceCard from '../components/marketplace/MarketplaceCard';
import { useCollection } from '../context/CollectionContext';
import { formatPrice, simulateLoading } from '../utils/formatters';
import { MarketplaceItem } from '../types';
import './ProductDetailPage.css';

const ProductDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [item, setItem] = useState<MarketplaceItem | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [relatedItems, setRelatedItems] = useState<MarketplaceItem[]>([]);
  const { isInCollection, addToCollection } = useCollection();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);
    
    // Simulate API fetch
    simulateLoading(600).then(() => {
      if (isMounted) {
        const foundItem = marketplaceItems.find(i => i.id === id);
        setItem(foundItem || null);
        
        if (foundItem) {
          const related = marketplaceItems
            .filter(i => i.category === foundItem.category && i.id !== foundItem.id)
            .slice(0, 4);
          setRelatedItems(related);
        }
        setIsLoading(false);
      }
    });

    return () => {
      isMounted = false;
    };
  }, [id]);

  if (isLoading) {
    return (
      <div className="product-detail-page">
         <DetailSkeleton />
      </div>
    );
  }

  if (!item) {
    return (
      <div className="product-detail-page">
        <EmptyState
          icon={SearchX}
          title="Product Not Found"
          description="The item you're looking for doesn't exist or has been removed."
          actionLabel="Back to Marketplace"
          onAction={() => navigate('/marketplace')}
        />
      </div>
    );
  }

  const getConditionVariant = (condition: string) => {
    switch (condition) {
      case 'Mint': return 'success';
      case 'Near Mint': return 'primary';
      case 'Good': return 'warning';
      case 'Fair': return 'default';
      default: return 'default';
    }
  };

  const isOwned = isInCollection('owned', item.id);
  const isWishlisted = isInCollection('wishlist', item.id);
  const isSelling = isInCollection('selling', item.id);

  const handleCollectionAction = (collectionType: 'owned' | 'wishlist' | 'selling') => {
    addToCollection(collectionType, item);
    setIsDropdownOpen(false);
  };

  return (
    <div className="product-detail-page">
      <button className="product-detail-page__back-btn" onClick={() => navigate(-1)}>
        <ArrowLeft size={20} />
        Back
      </button>

      <div className="product-detail">
        <div className="product-detail__image-container">
          <LazyImage src={item.image} alt={item.title} className="product-detail__image" />
        </div>
        
        <div className="product-detail__info">
          <div className="product-detail__header">
            <h1 className="product-detail__title">{item.title}</h1>
            <div className="product-detail__badges">
              <Badge variant="default">{item.category}</Badge>
              <Badge variant={getConditionVariant(item.condition)}>{item.condition}</Badge>
            </div>
          </div>
          
          <div className="product-detail__price-container">
            <span className="product-detail__price">{formatPrice(item.price)}</span>
          </div>
          
          <div className="product-detail__description">
            <h3>Description</h3>
            <p>{item.description}</p>
          </div>
          
          <div className="product-detail__meta">
            <div className="product-detail__seller">
              <div className="product-detail__seller-avatar">
                {item.seller.name.charAt(0).toUpperCase()}
              </div>
              <div className="product-detail__seller-info">
                <span className="product-detail__seller-name">{item.seller.name}</span>
                <span className="product-detail__seller-location">
                  <MapPin size={14} />
                  {item.location}
                </span>
              </div>
            </div>
            <div className="product-detail__date">
              Listed on {new Date(item.dateAdded).toLocaleDateString()}
            </div>
          </div>
          
          <div className="product-detail__actions">
            <div className="product-detail__dropdown-container">
              <button 
                className="product-detail__primary-btn"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              >
                Add to Collection
              </button>
              
              {isDropdownOpen && (
                <div className="product-detail__dropdown-menu">
                  <button 
                    className={`product-detail__dropdown-item ${isOwned ? 'active' : ''}`}
                    onClick={() => handleCollectionAction('owned')}
                  >
                    {isOwned && <Check size={16} />}
                    Owned
                  </button>
                  <button 
                    className={`product-detail__dropdown-item ${isWishlisted ? 'active' : ''}`}
                    onClick={() => handleCollectionAction('wishlist')}
                  >
                    {isWishlisted && <Check size={16} />}
                    Wishlist
                  </button>
                  <button 
                    className={`product-detail__dropdown-item ${isSelling ? 'active' : ''}`}
                    onClick={() => handleCollectionAction('selling')}
                  >
                    {isSelling && <Check size={16} />}
                    Selling
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {relatedItems.length > 0 && (
        <div className="product-detail__related">
          <h2>Related Items</h2>
          <div className="product-detail__related-grid">
            {relatedItems.map(relatedItem => (
              <MarketplaceCard
                key={relatedItem.id}
                item={relatedItem}
                viewMode="grid"
                onAddToWishlist={(i) => addToCollection('wishlist', i)}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetailPage;
