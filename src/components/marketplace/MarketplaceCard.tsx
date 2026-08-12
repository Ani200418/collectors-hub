import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { User, MapPin, Heart } from 'lucide-react';
import { MarketplaceItem } from '../../types';
import { ViewMode } from '../../types';
import LazyImage from '../common/LazyImage/LazyImage';
import Badge from '../common/Badge/Badge';
import { formatPrice } from '../../utils/formatters';
import { useCollection } from '../../context/CollectionContext';
import './MarketplaceCard.css';

interface MarketplaceCardProps {
  item: MarketplaceItem;
  viewMode: ViewMode;
  onAddToWishlist: (item: MarketplaceItem) => void;
}

const MarketplaceCard: React.FC<MarketplaceCardProps> = ({ item, viewMode, onAddToWishlist }) => {
  const { isInCollection } = useCollection();
  const isWishlisted = isInCollection('wishlist', item.id);
  const [isPressed, setIsPressed] = useState(false);

  const getConditionVariant = (condition: string) => {
    switch (condition) {
      case 'Mint': return 'success';
      case 'Near Mint': return 'primary';
      case 'Good': return 'warning';
      case 'Fair': return 'default';
      default: return 'default';
    }
  };

  const handleWishlistClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsPressed(true);
    setTimeout(() => setIsPressed(false), 200);
    onAddToWishlist(item);
  };

  return (
    <Link to={`/product/${item.id}`} className={`marketplace-card marketplace-card--${viewMode}`}>
      <div className="marketplace-card__image-container">
        <LazyImage src={item.image} alt={item.title} className="marketplace-card__image" />
        <button
          className={`marketplace-card__wishlist-btn ${isWishlisted ? 'active' : ''} ${isPressed ? 'pressed' : ''}`}
          onClick={handleWishlistClick}
          aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
        >
          <Heart className="marketplace-card__wishlist-icon" fill={isWishlisted ? "currentColor" : "none"} />
        </button>
      </div>
      <div className="marketplace-card__content">
        <div className="marketplace-card__badges">
          <Badge variant="default">{item.category}</Badge>
          <Badge variant={getConditionVariant(item.condition)}>{item.condition}</Badge>
        </div>
        <h3 className="marketplace-card__title" title={item.title}>{item.title}</h3>
        <p className="marketplace-card__price">{formatPrice(item.price)}</p>
        <div className="marketplace-card__seller-info">
          <span className="marketplace-card__seller-name">
            <User size={14} />
            {item.seller.name}
          </span>
          <span className="marketplace-card__seller-location">
            <MapPin size={14} />
            {item.location}
          </span>
        </div>
      </div>
    </Link>
  );
};

export default MarketplaceCard;
