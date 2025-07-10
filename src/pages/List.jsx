import React, { useEffect, useState, useRef } from 'react';
import api from '../api';
import styles from './List.module.css';
import { useNavigate } from 'react-router-dom';

export default function List() {
  const [posts, setPosts] = useState([]);
  const carouselRef = useRef(null);
  const navigate = useNavigate();

  const userId = localStorage.getItem('userId');
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchMyPosts = async () => {
      if (!userId || !token) {
        console.warn('로그인 정보가 없습니다.');
        return;
      }

      try {
        const res = await api.get(`/posts/user/${userId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setPosts(res.data);
      } catch (err) {
        console.error('❌ 게시글 불러오기 실패:', err);
        alert('작성한 글을 불러오는 중 오류가 발생했습니다.');
      }
    };

    fetchMyPosts();
  }, [userId, token]);

  useEffect(() => {
    if (carouselRef.current && posts.length >= 3) {
      const container = carouselRef.current;
      const cards = container.querySelectorAll(`.${styles.postCard}`);
      const middleIndex =
        Math.floor(posts.length / 2) - (posts.length % 2 === 0 ? 1 : 0);
      const targetCard = cards[middleIndex];

      if (targetCard) {
        const scrollLeft =
          targetCard.offsetLeft - container.offsetWidth / 2 + targetCard.offsetWidth / 2;
        container.scrollLeft = scrollLeft;
      }
    }
  }, [posts]);

  const handleClick = (postId) => {
    navigate(`/post/${postId}`); // 게시글 상세 페이지로 이동
  };

  const renderCard = (post) => (
    <div
      className={styles.postCard}
      key={post.id}
      onClick={() => handleClick(post.id)}
    >
      <div className={styles.postTitle}>{post.title}</div>
      <div className={styles.postDate}>{new Date(post.createdAt).toLocaleDateString()}</div>
      <div className={styles.postContent}>
        {post.content.length > 100 ? post.content.slice(0, 100) + '...' : post.content}
      </div>
    </div>
  );

  return (
    <div className={styles.ListScreen}>
      <div className={styles.div}>
        <div className={styles.view}>
          <div className={styles.titleGroup}>
            <div className={styles.title}>내가 쓴 글</div>
          </div>
        </div>

        {posts.length === 0 ? (
          <div>✏ 아직 작성한 글이 없습니다.</div>
        ) : posts.length <= 2 ? (
          <div className={styles.centerContainer}>{posts.map(renderCard)}</div>
        ) : (
          <div className={styles.carouselWrapper} ref={carouselRef}>
            <div className={styles.carousel}>{posts.map(renderCard)}</div>
          </div>
        )}
      </div>
    </div>
  );
}
