import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './UserProfile.module.css';
import ProfileEditor from '../components/ProfileEditor';

function UserProfile() {
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false); // 프로필 편집 모달 상태

  // 임시 유저 데이터 (백엔드 연결 전용)
  const user = {
    nickname: 'ㄱㄴㅇ',
    userId: 'kkk123',
    intro: '',
    profileImageUrl: 'https://via.placeholder.com/150', // 기본 이미지 URL
  };

  // 프로필 변경 클릭 핸들러
  const handleProfileEdit = () => {
    setIsEditing(true);
  };

  return (
    <div className={styles.Userscreen}>
      <div className={styles.profileLeft}>
        <div className={styles.profileImageWrapper}>
          <img
            className={styles.image}
            src={user.profileImageUrl}
            alt={user.nickname}
          />
        </div>

        <div
          className={styles.profileChange}
          onClick={handleProfileEdit}
          style={{ cursor: 'pointer' }}
        >
          프로필 변경
        </div>
      </div>

      <div className={styles.profileRight}>
        <div className={styles.userInfo}>
          <div className={styles.username}>{user.nickname}</div>
          <div className={styles.userId}>{user.userId}</div>
        </div>

        <div className={styles.introgroup}>
          <div className={styles.description}>{user.intro || '소개글이 없습니다.'}</div>
        </div>
      </div>

      {isEditing && <ProfileEditor user={user} onClose={() => setIsEditing(false)} />}
    </div>
  );
}

export default UserProfile;
