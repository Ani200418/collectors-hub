import { Category, Condition } from '../types';

export const CATEGORIES: Category[] = [
  'Trading Cards',
  'Vinyl Records',
  'Comics',
  'Vintage Toys',
  'Coins',
  'Stamps',
  'Art Prints',
  'Sneakers',
];

export const CONDITIONS: Condition[] = ['Mint', 'Near Mint', 'Good', 'Fair'];

export const CATEGORY_EMOJI: Record<Category, string> = {
  'Trading Cards': '🃏',
  'Vinyl Records': '🎵',
  'Comics': '📚',
  'Vintage Toys': '🧸',
  'Coins': '🪙',
  'Stamps': '📮',
  'Art Prints': '🎨',
  'Sneakers': '👟',
};

export const CONDITION_COLOR: Record<Condition, string> = {
  'Mint': 'var(--color-success)',
  'Near Mint': 'var(--color-primary)',
  'Good': 'var(--color-warning)',
  'Fair': 'var(--color-text-secondary)',
};
