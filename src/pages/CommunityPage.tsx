import React, { useState, useEffect, useMemo, useCallback } from 'react';
import SearchBar from '../components/common/SearchBar/SearchBar';
import FilterBar from '../components/common/FilterBar/FilterBar';
import CommunityCard from '../components/community/CommunityCard';
import { CardSkeleton } from '../components/common/Skeleton/Skeleton';
import EmptyState from '../components/common/EmptyState/EmptyState';
import { MessageCircle } from 'lucide-react';
import { CATEGORIES } from '../data/categories';
import { communityPosts } from '../data/community';
import { useDebounce } from '../hooks/useDebounce';
import { useInfiniteScroll } from '../hooks/useInfiniteScroll';
import { CommunityPost } from '../types';
import './CommunityPage.css';

const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest' },
  { value: 'oldest', label: 'Oldest' },
  { value: 'popular', label: 'Most Popular' }
];

export default function CommunityPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('newest');
  
  const [posts, setPosts] = useState<CommunityPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const debouncedSearch = useDebounce(searchQuery, 300);

  useEffect(() => {
    // Simulated loading
    const timer = setTimeout(() => {
      setPosts(communityPosts);
      setIsLoading(false);
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  const handleLike = useCallback((id: string) => {
    setPosts(prev => prev.map(post => {
      if (post.id === id) {
        return {
          ...post,
          liked: !post.liked,
          likes: post.liked ? post.likes - 1 : post.likes + 1
        };
      }
      return post;
    }));
  }, []);

  const handleSave = useCallback((id: string) => {
    setPosts(prev => prev.map(post => {
      if (post.id === id) {
        return {
          ...post,
          saved: !post.saved
        };
      }
      return post;
    }));
  }, []);

  const filteredAndSortedPosts = useMemo(() => {
    let result = [...posts];

    if (debouncedSearch) {
      const lowerQuery = debouncedSearch.toLowerCase();
      result = result.filter(post => 
        post.caption.toLowerCase().includes(lowerQuery) ||
        post.user.name.toLowerCase().includes(lowerQuery) ||
        post.user.handle.toLowerCase().includes(lowerQuery)
      );
    }

    if (selectedCategory && selectedCategory !== 'all') {
      result = result.filter(post => post.category === selectedCategory);
    }

    result.sort((a, b) => {
      switch (sortBy) {
        case 'oldest':
          return new Date(a.datePosted).getTime() - new Date(b.datePosted).getTime();
        case 'popular':
          return b.likes - a.likes;
        case 'newest':
        default:
          return new Date(b.datePosted).getTime() - new Date(a.datePosted).getTime();
      }
    });

    return result;
  }, [posts, debouncedSearch, selectedCategory, sortBy]);

  const { visibleItems, sentinelRef } = useInfiniteScroll(filteredAndSortedPosts, 6);

  return (
    <div className="community-page">
      <div className="community-page__header">
        <h1 className="community-page__title">Community</h1>
        <p className="community-page__subtitle">See what collectors are sharing</p>
      </div>

      <div className="community-page__controls">
        <SearchBar 
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder="Search by caption or username..."
        />
        <FilterBar
          categories={CATEGORIES}
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
          sortOptions={SORT_OPTIONS}
          selectedSort={sortBy}
          onSortChange={setSortBy}
        />
      </div>

      <div className="community-page__feed">
        {isLoading ? (
          <>
            <CardSkeleton />
            <CardSkeleton />
            <CardSkeleton />
          </>
        ) : filteredAndSortedPosts.length === 0 ? (
          <EmptyState 
            icon={MessageCircle}
            title="No posts found"
            description="Try adjusting your search or filters to find what you're looking for."
          />
        ) : (
          <>
            {visibleItems.map(post => (
              <CommunityCard 
                key={post.id} 
                post={post} 
                onLike={handleLike}
                onSave={handleSave}
              />
            ))}
            <div ref={sentinelRef} className="community-page__loader-trigger" />
          </>
        )}
      </div>
    </div>
  );
}
