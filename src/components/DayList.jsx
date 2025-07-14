import React, { useEffect, useState } from 'react';
import api from '../api';
import styles from './DayList.module.css';
import { useNavigate } from 'react-router-dom';

function formatDateToYYYYMMDD(dateStr) {
  const date = new Date(dateStr);
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, '0'); // 월은 0부터 시작하니까 +1
  const dd = String(date.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
}

export default function DayList({ selectedDate }) {
  const [posts, setPosts] = useState([]);
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  // 날짜별 게시글 불러오기
  useEffect(() => {
    const fetchPostsByDate = async () => {
      if (!selectedDate || !token) return;

      try {
        const res = await api.get(`/diaries?date=${selectedDate}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setPosts(res.data);
      } catch (error) {
        console.error('❌ 날짜별 글 불러오기 실패:', error);
      }
    };

    fetchPostsByDate();
  }, [selectedDate, token]);

  const handleClick = (postId) => {
    navigate(`/write/${postId}`);
  };

  return (
    <div className={styles.dayListContainer}>
      <h2 className={styles.heading}>
        📅 {formatDateToYYYYMMDD(selectedDate)}의 글 목록
      </h2>

      {posts.length === 0 ? (
        <p className={styles.noPostMessage}>해당 날짜에는 작성된 글이 없습니다.</p>
      ) : (
        <div className={styles.cardGrid}>
          {posts.map((post) => (
            <div
              key={post.id}
              className={styles.postCard}
              onClick={() => handleClick(post.id)}
            >
              <h3 className={styles.postTitle}>{post.title}</h3>
              <p className={styles.postContent}>
                {post.content.length > 100
                  ? post.content.slice(0, 100) + '...'
                  : post.content}
              </p>
              <div className={styles.footer}>
                <span className={styles.date}>
                  {formatDateToYYYYMMDD(post.createdAt)}
                </span>
                <span className={styles.likes}>❤️ {post.likeCount}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
