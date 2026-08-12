import React from 'react';
import './Skeleton.css';

export const CardSkeleton: React.FC = () => {
  return (
    <div className="skeleton-card">
      <div className="skeleton skeleton-card__image" />
      <div className="skeleton-card__content">
        <div className="skeleton skeleton-card__title" />
        <div className="skeleton skeleton-card__text" />
        <div className="skeleton skeleton-card__badge" />
      </div>
    </div>
  );
};

export const ListSkeleton: React.FC = () => {
  return (
    <div className="skeleton-list-item">
      <div className="skeleton skeleton-list-item__avatar" />
      <div className="skeleton-list-item__content">
        <div className="skeleton skeleton-list-item__title" />
        <div className="skeleton skeleton-list-item__subtitle" />
      </div>
    </div>
  );
};

export const DetailSkeleton: React.FC = () => {
  return (
    <div className="skeleton-detail">
      <div className="skeleton skeleton-detail__header" />
      <div className="skeleton skeleton-detail__content">
        <div className="skeleton skeleton-detail__line" />
        <div className="skeleton skeleton-detail__line" />
        <div className="skeleton skeleton-detail__line w-75" />
      </div>
    </div>
  );
};
