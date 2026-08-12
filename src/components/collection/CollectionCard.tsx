import React, { useState, useRef, useEffect } from 'react';
import { Trash2, ArrowRightLeft, Package, Heart, Tag } from 'lucide-react';
import { CollectionItem, CollectionType, ViewMode } from '../../types';
import LazyImage from '../common/LazyImage/LazyImage';
import Badge from '../common/Badge/Badge';
import { formatDate, formatPrice } from '../../utils/formatters';
import './CollectionCard.css';

interface CollectionCardProps {
  item: CollectionItem;
  collection: CollectionType;
  viewMode: ViewMode;
  onRemove: (id: string) => void;
  onMove: (id: string, to: CollectionType) => void;
}

const CollectionCard: React.FC<CollectionCardProps> = ({ item, collection, viewMode, onRemove, onMove }) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const moveOptions = [
    { id: 'owned', label: 'Owned', icon: Package },
    { id: 'wishlist', label: 'Wishlist', icon: Heart },
    { id: 'selling', label: 'Selling', icon: Tag },
  ].filter(opt => opt.id !== collection);

  const handleMove = (to: CollectionType) => {
    onMove(item.id, to);
    setShowDropdown(false);
  };

  const handleRemove = () => {
    if (window.confirm('Are you sure you want to remove this item?')) {
      onRemove(item.id);
    }
  };

  return (
    <div className={`collection-card collection-card--${viewMode}`}>
      <div className="collection-card__image-container">
        <LazyImage src={item.image} alt={item.title} className="collection-card__image" />
      </div>
      <div className="collection-card__content">
        <div className="collection-card__header">
          <h3 className="collection-card__title">{item.title}</h3>
          <div className="collection-card__badges">
            <Badge variant="primary">{item.category}</Badge>
            {item.condition && <Badge variant="default">{item.condition}</Badge>}
          </div>
        </div>
        
        <div className="collection-card__details">
          <p className="collection-card__date">Added: {formatDate(item.dateAdded)}</p>
          <p className="collection-card__price">{formatPrice(item.estimatedValue)}</p>
        </div>

        <div className="collection-card__actions">
          <div className="collection-card__dropdown-container" ref={dropdownRef}>
            <button 
              className="collection-card__btn collection-card__btn--move"
              onClick={() => setShowDropdown(!showDropdown)}
              title="Move to..."
            >
              <ArrowRightLeft size={16} />
              <span>Move</span>
            </button>
            {showDropdown && (
              <div className="collection-card__dropdown">
                {moveOptions.map(opt => {
                  const Icon = opt.icon;
                  return (
                    <button 
                      key={opt.id} 
                      className="collection-card__dropdown-item"
                      onClick={() => handleMove(opt.id as CollectionType)}
                    >
                      <Icon size={14} />
                      <span>{opt.label}</span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
          <button 
            className="collection-card__btn collection-card__btn--remove"
            onClick={handleRemove}
            title="Remove item"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default CollectionCard;
