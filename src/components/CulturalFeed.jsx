import React, { useState, useEffect } from 'react';
import { Heart, MessageCircle, Share, Play } from 'lucide-react';

const CulturalFeed = () => {
  const [points, setPoints] = useState(9800);
  const [feedItems, setFeedItems] = useState([]);

  useEffect(() => {
    // 模拟加载文化内容
    const mockFeedItems = [
      {
        id: 1,
        title: 'Kapri Tanaka',
        location: 'ARIZONA',
        image: '/api/placeholder/400/300',
        type: 'cultural-site',
        points: 200,
        category: 'Traditional Architecture'
      },
      {
        id: 2,
        title: 'esrucbo',
        location: 'AMERICAN',
        image: '/api/placeholder/400/300',
        type: 'video',
        duration: '41:2:05',
        category: 'Folk Music'
      },
      {
        id: 3,
        title: 'Etrakatia bmos',
        location: 'CEETSE',
        image: '/api/placeholder/400/300',
        type: 'cultural-practice',
        points: 120,
        category: 'Traditional Dance'
      }
    ];
    setFeedItems(mockFeedItems);
  }, []);

  const handleLike = (itemId) => {
    setFeedItems(items => 
      items.map(item => 
        item.id === itemId 
          ? { ...item, liked: !item.liked }
          : item
      )
    );
  };

  return (
    <div className="cultural-feed">
      {/* Header */}
      <div className="feed-header">
        <div className="header-content">
          <div className="app-logo">
            <div className="logo-icon-small">
              <div className="logo-bridge-small"></div>
            </div>
            <span className="app-name">CultureBridge</span>
          </div>
          <div className="points-display">
            <span className="points-value">{points.toLocaleString()}</span>
            <span className="points-label">积分</span>
          </div>
        </div>
      </div>

      {/* Feed Title */}
      <div className="feed-title-section">
        <h1 className="feed-title">Cultural<br />Content Feed</h1>
      </div>

      {/* Feed Content */}
      <div className="feed-content">
        {/* Main Featured Item */}
        <div className="featured-item">
          <div className="featured-image">
            <img 
              src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop" 
              alt="Mount Fuji landscape"
              className="item-image"
            />
            <div className="featured-overlay">
              <div className="featured-info">
                <div className="author-info">
                  <div className="author-avatar">
                    <img 
                      src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=40&h=40&fit=crop&crop=face" 
                      alt="Kapri Tanaka"
                    />
                  </div>
                  <div className="author-details">
                    <h3 className="author-name">Kapri Tanaka</h3>
                    <p className="author-location">ARIZONA</p>
                  </div>
                </div>
                <div className="item-points">
                  <span className="points-icon">⭐</span>
                  <span className="points-text">200</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Grid Items */}
        <div className="feed-grid">
          <div className="grid-item">
            <div className="grid-item-image">
              <img 
                src="https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=200&h=200&fit=crop" 
                alt="Traditional music"
                className="item-image"
              />
              {/* Video Play Button */}
              <div className="video-overlay">
                <Play className="play-icon" size={24} fill="white" />
              </div>
              <div className="video-duration">41:2:05</div>
            </div>
            <div className="grid-item-info">
              <div className="item-author">
                <div className="author-avatar-small">
                  <img 
                    src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=30&h=30&fit=crop&crop=face" 
                    alt="esrucbo"
                  />
                </div>
                <span className="author-name-small">esrucbo</span>
              </div>
              <p className="item-location">AMERICAN</p>
            </div>
          </div>

          <div className="grid-item">
            <div className="grid-item-image">
              <img 
                src="https://images.unsplash.com/photo-1547036967-23d11aacaee0?w=200&h=200&fit=crop" 
                alt="Traditional dance"
                className="item-image"
              />
            </div>
            <div className="grid-item-info">
              <div className="item-author">
                <div className="author-avatar-small">
                  <img 
                    src="https://images.unsplash.com/photo-1494790108755-2616b612b786?w=30&h=30&fit=crop&crop=face" 
                    alt="Etrakatia"
                  />
                </div>
                <span className="author-name-small">Etrakatia bmos</span>
              </div>
              <p className="item-location">CEETSE 17:mm 12:09</p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="feed-actions">
          <button className="action-button like-button">
            <Heart size={20} />
          </button>
          <button className="action-button comment-button">
            <MessageCircle size={20} />
          </button>
          <button className="action-button share-button">
            <Share size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default CulturalFeed;

