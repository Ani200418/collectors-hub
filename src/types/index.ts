export interface MarketplaceItem {
  id: string;
  title: string;
  image: string;
  category: Category;
  condition: Condition;
  price: number;
  seller: {
    name: string;
    avatar: string;
  };
  location: string;
  description: string;
  dateAdded: string;
}

export interface CommunityPost {
  id: string;
  user: {
    name: string;
    avatar: string;
    handle: string;
  };
  image: string;
  caption: string;
  category: Category;
  likes: number;
  comments: number;
  liked: boolean;
  saved: boolean;
  datePosted: string;
}

export interface CollectionItem {
  id: string;
  sourceId: string;
  title: string;
  image: string;
  category: Category;
  dateAdded: string;
  estimatedValue: number;
  condition?: Condition;
}

export type CollectionType = 'owned' | 'wishlist' | 'selling';

export type Category =
  | 'Trading Cards'
  | 'Vinyl Records'
  | 'Comics'
  | 'Vintage Toys'
  | 'Coins'
  | 'Stamps'
  | 'Art Prints'
  | 'Sneakers';

export type Condition = 'Mint' | 'Near Mint' | 'Good' | 'Fair';

export type SortOption = 'price-asc' | 'price-desc' | 'newest' | 'oldest' | 'value-asc' | 'value-desc' | 'name-asc' | 'name-desc';

export type ViewMode = 'grid' | 'list';

export interface FilterState {
  search: string;
  category: Category | 'all';
  condition: Condition | 'all';
  sort: SortOption;
}

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
  duration?: number;
}
