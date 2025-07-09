import React, { useState, useRef } from 'react';
import styles from './ProfileEditor.module.css';

function ProfileEditor({ onClose }) {
  const [image, setImage] = useState(null); // 기본 이미지 없음
  const [username, setUsername] = useState('');
  const [userid, setUserid] = useState('');
  const [intro, setIntro] = useState('');
  const [isCheckingId, setIsCheckingId] = useState(false);

  const fileInputRef = useRef();

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImageClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleIdCheck = () => {
    setIsCheckingId(true);
    setTimeout(() => {
      alert('중복확인 완료 (백엔드 미연결 상태)');
      setIsCheckingId(false);
    }, 1000);
  };

  const handleSave = () => {
    alert('변경 완료 (백엔드 미연결 상태)');
    if (onClose) onClose();
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.card}>
        <div className={styles.header}>
          <button className={styles.closeBtn} onClick={onClose}>×</button>
        </div>

        <div className={styles.left}>
          <img
            src={image || 'https://via.placeholder.com/150'}
            alt="프로필"
            className={styles.profileImage}
          />
          <input
            type="file"
            ref={fileInputRef}
            accept="image/*"
            style={{ display: 'none' }}
            onChange={handleImageChange}
          />
          <div
            className={styles.imageLabel}
            onClick={handleImageClick}
            style={{ cursor: 'pointer' }}
          >
            IMAGE
          </div>
        </div>

        <div className={styles.right}>
          <input
            className={styles.usernameInput}
            placeholder="이름"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            onFocus={(e) => e.target.select()}
          />

          <div className={styles.useridRow}>
            <input
              className={styles.useridInput}
              placeholder="아이디"
              value={userid}
              onChange={(e) => setUserid(e.target.value)}
              onFocus={(e) => e.target.select()}
            />
            <button
              className={styles.checkButton}
              onClick={handleIdCheck}
              disabled={isCheckingId}
            >
              {isCheckingId ? '확인 중...' : '중복확인'}
            </button>
          </div>

          <div className={styles.introRow}>
            <div className={styles.introLabel}>소개</div>
            <input
              className={styles.introInput}
              placeholder="소개를 입력하세요"
              value={intro}
              onChange={(e) => setIntro(e.target.value)}
              onFocus={(e) => e.target.select()}
            />
          </div>
        </div>

        <div className={styles.saveButton} onClick={handleSave}>
          변경완료
        </div>
      </div>
    </div>
  );
}

export default ProfileEditor;
