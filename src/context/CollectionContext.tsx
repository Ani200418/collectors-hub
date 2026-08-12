import React, { createContext, useContext, useCallback } from 'react';
import { CollectionItem, CollectionType, MarketplaceItem } from '../types';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { useToast } from './ToastContext';
import { generateId } from '../utils/formatters';

interface CollectionState {
  owned: CollectionItem[];
  wishlist: CollectionItem[];
  selling: CollectionItem[];
}

interface CollectionContextType {
  collections: CollectionState;
  addToCollection: (collection: CollectionType, item: MarketplaceItem | CollectionItem) => boolean;
  removeFromCollection: (collection: CollectionType, itemId: string) => void;
  moveItem: (fromCollection: CollectionType, toCollection: CollectionType, itemId: string) => void;
  isInCollection: (collection: CollectionType, sourceId: string) => boolean;
  getCollectionCount: (collection: CollectionType) => number;
  getTotalValue: (collection: CollectionType) => number;
}

const CollectionContext = createContext<CollectionContextType | undefined>(undefined);

const initialState: CollectionState = {
  owned: [],
  wishlist: [],
  selling: [],
};

export function CollectionProvider({ children }: { children: React.ReactNode }) {
  const [collections, setCollections] = useLocalStorage<CollectionState>('ch-collections', initialState);
  const { addToast } = useToast();

  const isInCollection = useCallback(
    (collection: CollectionType, sourceId: string): boolean => {
      return collections[collection].some((item) => item.sourceId === sourceId);
    },
    [collections]
  );

  const addToCollection = useCallback(
    (collection: CollectionType, item: MarketplaceItem | CollectionItem): boolean => {
      const sourceId = 'sourceId' in item ? item.sourceId : item.id;

      if (isInCollection(collection, sourceId)) {
        const collectionName = collection.charAt(0).toUpperCase() + collection.slice(1);
        addToast('warning', `This item is already in your ${collectionName} collection`);
        return false;
      }

      const newItem: CollectionItem = {
        id: generateId(),
        sourceId,
        title: item.title,
        image: item.image,
        category: item.category,
        dateAdded: new Date().toISOString().split('T')[0],
        estimatedValue: 'price' in item ? item.price : ('estimatedValue' in item ? item.estimatedValue : 0),
        condition: 'condition' in item ? item.condition : undefined,
      };

      setCollections((prev) => ({
        ...prev,
        [collection]: [...prev[collection], newItem],
      }));

      const collectionName = collection.charAt(0).toUpperCase() + collection.slice(1);
      addToast('success', `Added to ${collectionName}!`);
      return true;
    },
    [isInCollection, setCollections, addToast]
  );

  const removeFromCollection = useCallback(
    (collection: CollectionType, itemId: string) => {
      setCollections((prev) => ({
        ...prev,
        [collection]: prev[collection].filter((item) => item.id !== itemId),
      }));
      addToast('info', 'Item removed from collection');
    },
    [setCollections, addToast]
  );

  const moveItem = useCallback(
    (fromCollection: CollectionType, toCollection: CollectionType, itemId: string) => {
      const item = collections[fromCollection].find((i) => i.id === itemId);
      if (!item) return;

      if (isInCollection(toCollection, item.sourceId)) {
        const toName = toCollection.charAt(0).toUpperCase() + toCollection.slice(1);
        addToast('warning', `This item is already in your ${toName} collection`);
        return;
      }

      setCollections((prev) => ({
        ...prev,
        [fromCollection]: prev[fromCollection].filter((i) => i.id !== itemId),
        [toCollection]: [...prev[toCollection], { ...item, dateAdded: new Date().toISOString().split('T')[0] }],
      }));

      const toName = toCollection.charAt(0).toUpperCase() + toCollection.slice(1);
      addToast('success', `Moved to ${toName}!`);
    },
    [collections, isInCollection, setCollections, addToast]
  );

  const getCollectionCount = useCallback(
    (collection: CollectionType): number => collections[collection].length,
    [collections]
  );

  const getTotalValue = useCallback(
    (collection: CollectionType): number =>
      collections[collection].reduce((sum, item) => sum + item.estimatedValue, 0),
    [collections]
  );

  return (
    <CollectionContext.Provider
      value={{ collections, addToCollection, removeFromCollection, moveItem, isInCollection, getCollectionCount, getTotalValue }}
    >
      {children}
    </CollectionContext.Provider>
  );
}

export function useCollection(): CollectionContextType {
  const context = useContext(CollectionContext);
  if (!context) {
    throw new Error('useCollection must be used within a CollectionProvider');
  }
  return context;
}
