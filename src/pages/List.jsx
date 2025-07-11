import React, { useEffect, useState, useRef } from 'react';
import api from '../api';
import EditModal from '../components/EditModal';  // EditModal import
import styles from './List.module.css';
import { useNavigate } from 'react-router-dom';

export default function List() {
  const [posts, setPosts] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const carouselRef = useRef(null);
  const navigate = useNavigate();

  const userId = localStorage.getItem('userId');
  const token = localStorage.getItem('token');

  // 게시글 불러오기 함수 분리
  const fetchMyPosts = async () => {
    if (!userId || !token) {
      console.warn('로그인 정보가 없습니다.');
      return;
    }

    try {
      const res = await api.get(`/diaries/members/${userId}`, {
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

  // 초기 렌더링 시 글 불러오기
  useEffect(() => {
    fetchMyPosts();
  }, []);

  // 글이 3개 이상일 때 캐러셀 가운데 맞춤
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

  // 글 상세 페이지 이동
  const handleClick = (diary_id) => {
    navigate(`/write/${diary_id}`);
  };

  // 새 글 저장 후 호출될 함수 (EditModal에서 onSave로 전달됨)
  const handleSave = (newPost) => {
    // 1) 새 글을 바로 posts에 추가
    setPosts((prevPosts) => [newPost, ...prevPosts]);
    
    // 2) 모달 닫기
    setModalOpen(false);
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
          <div>아직 작성한 글이 없습니다.</div>
        ) : posts.length <= 2 ? (
          <div className={styles.centerContainer}>{posts.map(renderCard)}</div>
        ) : (
          <div className={styles.carouselWrapper} ref={carouselRef}>
            <div className={styles.carousel}>{posts.map(renderCard)}</div>
          </div>
        )}
      </div>

      {/* EditModal 열기 */}
      {modalOpen && (
        <EditModal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          onSave={handleSave}  // 새 글 저장 후 posts 상태 업데이트 함수 전달
        />
      )}
    </div>
  );
}
