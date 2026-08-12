import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Heart, MessageCircle, Bookmark, Send } from 'lucide-react';
import { communityPosts } from '../data/community';
import LazyImage from '../components/common/LazyImage/LazyImage';
import Badge from '../components/common/Badge/Badge';
import EmptyState from '../components/common/EmptyState/EmptyState';
import { DetailSkeleton } from '../components/common/Skeleton/Skeleton';
import { formatDate, formatNumber } from '../utils/formatters';
import { CommunityPost } from '../types';
import './PostDetailPage.css';

const MOCK_COMMENTS = [
  {
    id: 'c1',
    user: { name: 'Alice Smith', avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026704d' },
    text: 'Wow, this is an incredible piece! The condition is amazing.',
    date: '2 hours ago'
  },
  {
    id: 'c2',
    user: { name: 'Bob Jones', avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026704e' },
    text: 'I have been looking for one of these for years. So jealous!',
    date: '4 hours ago'
  },
  {
    id: 'c3',
    user: { name: 'Charlie Brown', avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026704f' },
    text: 'Thanks for sharing the story behind it too.',
    date: '5 hours ago'
  }
];

export default function PostDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const [post, setPost] = useState<CommunityPost | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Local state for interactions
  const [isLiked, setIsLiked] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [likesCount, setLikesCount] = useState(0);

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      const foundPost = communityPosts.find(p => p.id === id);
        if (foundPost) {
          setPost(foundPost);
          setIsLiked(foundPost.liked || false);
          setIsSaved(foundPost.saved || false);
        setLikesCount(foundPost.likes || 0);
      }
      setIsLoading(false);
    }, 600);

    return () => clearTimeout(timer);
  }, [id]);

  const handleLike = () => {
    setIsLiked(!isLiked);
    setLikesCount(prev => isLiked ? prev - 1 : prev + 1);
  };

  const handleSave = () => {
    setIsSaved(!isSaved);
  };

  if (isLoading) {
    return (
      <div className="post-detail-page">
        <DetailSkeleton />
      </div>
    );
  }

  if (!post) {
    return (
      <div className="post-detail-page">
        <button onClick={() => navigate(-1)} className="post-detail__back-btn">
          <ArrowLeft size={20} /> Back
        </button>
        <EmptyState 
          icon={MessageCircle}
          title="Post not found"
          description="The post you're looking for doesn't exist or has been removed."
        />
      </div>
    );
  }

  return (
    <div className="post-detail-page">
      <button onClick={() => navigate(-1)} className="post-detail__back-btn">
        <ArrowLeft size={20} /> Back
      </button>

      <div className="post-detail__card">
        <div className="post-detail__header">
          <img src={post.user.avatar} alt={post.user.name} className="post-detail__avatar" />
          <div className="post-detail__user-info">
            <span className="post-detail__user-name">{post.user.name}</span>
            <span className="post-detail__user-handle">{post.user.handle}</span>
          </div>
          <span className="post-detail__date">{formatDate(post.datePosted)}</span>
        </div>

        <div className="post-detail__image-container">
          <LazyImage src={post.image} alt="Post image" className="post-detail__image" />
        </div>

        <div className="post-detail__action-bar">
          <div className="post-detail__actions-left">
            <button 
              className={`post-detail__action-btn ${isLiked ? 'post-detail__action-btn--liked' : ''}`}
              onClick={handleLike}
              aria-label="Like post"
            >
              <Heart className={`post-detail__icon ${isLiked ? 'post-detail__icon--liked' : ''}`} />
            </button>
            <button className="post-detail__action-btn" aria-label="Comment">
              <MessageCircle className="post-detail__icon" />
            </button>
          </div>
          <button 
            className={`post-detail__action-btn ${isSaved ? 'post-detail__action-btn--saved' : ''}`}
            onClick={handleSave}
            aria-label="Save post"
          >
            <Bookmark className={`post-detail__icon ${isSaved ? 'post-detail__icon--saved' : ''}`} />
          </button>
        </div>

        <div className="post-detail__stats">
          <span className="post-detail__stat">{formatNumber(likesCount)} likes</span>
          <span className="post-detail__stat">{formatNumber(post.comments)} comments</span>
        </div>

        <div className="post-detail__content">
          <p className="post-detail__caption">{post.caption}</p>
          <div className="post-detail__badge-wrapper">
            <Badge variant="primary">{post.category}</Badge>
          </div>
        </div>
      </div>

      <div className="post-detail__comments-section">
        <h3 className="post-detail__comments-title">Comments</h3>
        
        <div className="post-detail__comments-list">
          {MOCK_COMMENTS.map(comment => (
            <div key={comment.id} className="post-detail__comment">
              <img src={comment.user.avatar} alt={comment.user.name} className="post-detail__comment-avatar" />
              <div className="post-detail__comment-content">
                <div className="post-detail__comment-header">
                  <span className="post-detail__comment-author">{comment.user.name}</span>
                  <span className="post-detail__comment-date">{comment.date}</span>
                </div>
                <p className="post-detail__comment-text">{comment.text}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="post-detail__comment-input-wrapper">
          <input 
            type="text" 
            placeholder="Add a comment..." 
            className="post-detail__comment-input"
            disabled
          />
          <button className="post-detail__comment-submit" disabled>
            <Send size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}
