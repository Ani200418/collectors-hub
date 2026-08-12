import React from 'react';
import { Package, Heart, Tag } from 'lucide-react';
import { CollectionType } from '../../types';
import './CollectionTabs.css';

interface CollectionTabsProps {
  activeTab: CollectionType;
  onTabChange: (tab: CollectionType) => void;
  counts: Record<CollectionType, number>;
}

const CollectionTabs: React.FC<CollectionTabsProps> = ({ activeTab, onTabChange, counts }) => {
  const tabs = [
    { id: 'owned' as CollectionType, label: 'Owned', icon: Package },
    { id: 'wishlist' as CollectionType, label: 'Wishlist', icon: Heart },
    { id: 'selling' as CollectionType, label: 'Selling', icon: Tag },
  ];

  return (
    <div className="collection-tabs">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            className={`collection-tabs__button ${isActive ? 'collection-tabs__button--active' : ''}`}
            onClick={() => onTabChange(tab.id)}
          >
            <Icon className="collection-tabs__icon" size={18} />
            <span className="collection-tabs__label">{tab.label}</span>
            <span className="collection-tabs__badge">{counts[tab.id] || 0}</span>
          </button>
        );
      })}
    </div>
  );
};

export default CollectionTabs;
