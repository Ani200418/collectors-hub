import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, MessageCircle, Bookmark } from 'lucide-react';
import { formatDate, formatNumber } from '../../utils/formatters';
import LazyImage from '../common/LazyImage/LazyImage';
import Badge from '../common/Badge/Badge';
import './CommunityCard.css';
import { CommunityPost } from '../../types';

interface CommunityCardProps {
  post: CommunityPost;
  onLike: (id: string) => void;
  onSave: (id: string) => void;
}

export default function CommunityCard({ post, onLike, onSave }: CommunityCardProps) {
  const [isLiked, setIsLiked] = useState(post.liked);
  const [isSaved, setIsSaved] = useState(post.saved);
  const [likesCount, setLikesCount] = useState(post.likes);

  const handleLike = () => {
    setIsLiked(!isLiked);
    setLikesCount(prev => isLiked ? prev - 1 : prev + 1);
    onLike(post.id);
  };

  const handleSave = () => {
    setIsSaved(!isSaved);
    onSave(post.id);
  };

  const truncatedCaption = post.caption.length > 150 
    ? post.caption.slice(0, 150) + '...' 
    : post.caption;

  return (
    <div className="community-card">
      <div className="community-card__header">
        <img src={post.user.avatar} alt={post.user.name} className="community-card__avatar" />
        <div className="community-card__user-info">
          <span className="community-card__user-name">{post.user.name}</span>
          <span className="community-card__user-handle">@{post.user.handle}</span>
        </div>
        <span className="community-card__date">{formatDate(post.datePosted)}</span>
      </div>

      <div className="community-card__image-container">
        <LazyImage src={post.image} alt="Post image" className="community-card__image" />
      </div>

      <div className="community-card__action-bar">
        <div className="community-card__actions-left">
          <button 
            className={`community-card__action-btn ${isLiked ? 'community-card__action-btn--liked' : ''}`}
            onClick={handleLike}
            aria-label="Like post"
          >
            <Heart className={`community-card__icon ${isLiked ? 'community-card__icon--liked' : ''}`} />
          </button>
          <Link to={`/community/${post.id}`} className="community-card__action-btn">
            <MessageCircle className="community-card__icon" />
          </Link>
        </div>
        <button 
          className={`community-card__action-btn ${isSaved ? 'community-card__action-btn--saved' : ''}`}
          onClick={handleSave}
          aria-label="Save post"
        >
          <Bookmark className={`community-card__icon ${isSaved ? 'community-card__icon--saved' : ''}`} />
        </button>
      </div>

      <div className="community-card__stats">
        <span className="community-card__stat">{formatNumber(likesCount)} likes</span>
        <span className="community-card__stat">{formatNumber(post.comments)} comments</span>
      </div>

      <div className="community-card__content">
        <p className="community-card__caption">
          {truncatedCaption}
          {post.caption.length > 150 && (
            <Link to={`/community/${post.id}`} className="community-card__read-more"> Read more</Link>
          )}
        </p>
        <Badge variant="primary">{post.category}</Badge>
      </div>
    </div>
  );
}
