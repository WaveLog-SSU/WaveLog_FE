// src/pages/MainScreen.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Calendar from "../components/Calendar";
import EditModal from "../components/EditModal";
import SearchModal from "../components/SearchModal";
import styles from "./MainScreen.module.css";
import { useAuth } from "../contexts/AuthContext";
import api from "../api";

const profileImg =
  "https://storage.googleapis.com/tagjs-prod.appspot.com/v1/Pj2S5T474o/ir4t7nuw_expires_30_days.png";

const imageSets = {
  "0-4": ["https://via.placeholder.com/80?text=A1"],
  "5-9": ["https://via.placeholder.com/80?text=B1"],
  "10-14": ["https://via.placeholder.com/80?text=C1"],
  "15-19": ["https://via.placeholder.com/80?text=D1"],
  "20-24": ["https://via.placeholder.com/80?text=E1"],
  "25+": ["https://via.placeholder.com/80?text=F1"],
};

export default function MainScreen() {
  const navigate = useNavigate();
  const { isLoggedIn, logout } = useAuth();

  // 모달 상태 분리
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  // 선택된 다이어리 (수정용)
  const [selectedDiary, setSelectedDiary] = useState(null);

  // EditModal 초기값
  const [title, setTitle] = useState("");
  const [code, setCode] = useState("");
  const [desc, setDesc] = useState("");
  const [category, setCategory] = useState("CATEGORY");
  const [hashtags, setHashtags] = useState([]);

  // wave API 결과
  const [waveCount, setWaveCount] = useState(0);

  const userId = localStorage.getItem("userId");
  const token = localStorage.getItem("token");

  // 1) wave API 호출
  useEffect(() => {
    if (!userId || !token) return;

    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth() + 1;

    api
      .get(`/diaries/wave/${userId}?year=${year}&month=${month}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setWaveCount(res.data.count ?? 0);
      })
      .catch((err) => {
        console.error("wave API 호출 실패", err);
        setWaveCount(0);
      });
  }, [userId, token]);

  // 파도 이미지 선택
  const getKey = (n) => {
    if (n < 5) return "0-4";
    if (n < 10) return "5-9";
    if (n < 15) return "10-14";
    if (n < 20) return "15-19";
    if (n < 25) return "20-24";
    return "25+";
  };
  const currentImages = imageSets[getKey(waveCount)];

  // 프로필 / 로그인 토글
  const goToProfile = () => navigate("/profile");
  const handleLoginToggle = () => {
    if (isLoggedIn) {
      logout();
      localStorage.removeItem("token");
      localStorage.removeItem("userId");
      alert("로그아웃 되었습니다.");
      navigate("/login");
    } else {
      navigate("/login");
    }
  };

  // EditModal 열기 (쓰기/수정)
  const openEditModal = (diary = null) => {
    if (diary) {
      setSelectedDiary(diary);
      setTitle(diary.title);
      setCode(diary.code);
      setDesc(diary.content);
      setCategory(diary.category);
      setHashtags(diary.hashtags || []);
    } else {
      setSelectedDiary(null);
      setTitle("");
      setCode("");
      setDesc("");
      setCategory("CATEGORY");
      setHashtags([]);
    }
    setIsEditOpen(true);
  };
  const closeEditModal = () => setIsEditOpen(false);

  // SearchModal 열기
  const openSearchModal = () => {
    setIsSearchOpen(true);
  };
  const closeSearchModal = () => setIsSearchOpen(false);

  // EditModal 저장 콜백
  const handleSave = (data) => {
    console.log("저장된 데이터:", data);
    closeEditModal();
  };

  return (
    <div className={styles.container}>
      {/* 왼쪽 섹션 */}
      <div className={styles.leftSection}>
        <div className={styles.imagePanel}>
          {currentImages.map((url, i) => (
            <img
              key={i}
              src={url}
              alt={`wave-img-${i}`}
              className={styles.sideImage}
            />
          ))}
        </div>

        <div className={styles.topTextMenu}>
          <div className={styles.leftMenuGroup}>
            <button
              className={styles.myButton}
              onClick={() => navigate("/list")}
            >
              LIST
            </button>
            <button
              className={styles.myButton}
              onClick={() => navigate("/bookmark")}
            >
              BOOKMARK
            </button>
            <button
              className={styles.myButton}
              onClick={openSearchModal}
            >
              SEARCH
            </button>
            <button
              className={styles.myButton}
              onClick={() => openEditModal()}
            >
              WRITE
            </button>
            <button
              className={styles.myButton}
              onClick={() => navigate("/quiz")}
            >
              QUIZ
            </button>
          </div>
          <div className={styles.rightMenuButton}>
            <button
              className={styles.myButton}
              onClick={handleLoginToggle}
            >
              {isLoggedIn ? "LOGOUT" : "LOGIN"}
            </button>
          </div>
        </div>
      </div>

      {/* 오른쪽 섹션 */}
      <div className={styles.rightSection}>
        <div className={styles.profileBox} onClick={goToProfile}>
          <img
            src={profileImg}
            alt="profile"
            className={styles.profileImg}
          />
        </div>
        <Calendar />
      </div>

      {/* EditModal */}
      {isEditOpen && (
        <EditModal
          isOpen={isEditOpen}
          onClose={closeEditModal}
          onSave={handleSave}
          diaryId={selectedDiary?.diary_id}
          initialTitle={title}
          initialCode={code}
          initialDesc={desc}
          initialCategory={category}
          initialHashtags={hashtags}
        />
      )}

      {/* SearchModal */}
      {isSearchOpen && (
        <SearchModal
          isOpen={isSearchOpen}
          onClose={closeSearchModal}
        />
      )}
    </div>
  );
}
