// src/components/SearchModal.jsx
import React, { useState, useEffect } from 'react';
import api from '../api';
import styles from './SearchModal.module.css';
import { useNavigate } from 'react-router-dom';

export default function SearchModal({ isOpen, onClose }) {
  const [posts, setPosts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    if (!isOpen) return;

    const term = searchTerm.trim();
    if (!term) {
      setPosts([]);
      return;
    }

const token = localStorage.getItem('token');

const fetchResults = async () => {
  try {
    const res = await api.get('/diaries/search', {
      params: { q: term },
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    setPosts(res.data);
  } catch (err) {
    console.error('검색 API 실패:', err);
    setPosts([]);
  }
};


    fetchResults();
  }, [searchTerm, isOpen]);

  const handleCardClick = (diary_id) => {
    onClose();
    navigate(`/write/${diary_id}`);
  };

  if (!isOpen) return null;

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <div className={styles.header}>
          <input
            type="text"
            className={styles.searchInput}
            placeholder="제목을 검색하세요"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            autoFocus
          />
          <button className={styles.closeBtn} onClick={onClose}>
            ✕
          </button>
        </div>

        <div className={styles.results}>
          {searchTerm.trim() === '' ? (
            <p className={styles.empty}>검색어를 입력하세요.</p>
          ) : posts.length === 0 ? (
            <p className={styles.empty}>검색 결과가 없습니다.</p>
          ) : (
            posts.map((post) => (
              <div
                key={post.id}
                className={styles.postCard}
                onClick={() => handleCardClick(post.id)}
              >
                <div className={styles.postTitle}>{post.title}</div>
                <div className={styles.postMeta}>
                  <span className={styles.postDate}>
                    {new Date(post.createdAt).toLocaleDateString()}
                  </span>
                  <span className={styles.postInfo}>
                    조회 {post.viewCount} · 좋아요 {post.likeCount}
                  </span>
                </div>
                <div className={styles.postContent}>
                  {post.content.length > 100
                    ? post.content.slice(0, 100) + '…'
                    : post.content}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
