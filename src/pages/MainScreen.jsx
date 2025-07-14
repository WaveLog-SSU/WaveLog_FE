import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Calendar from "../components/Calendar.jsx";
import EditModal from "../components/EditModal.jsx";
import SearchModal from "../components/SearchModal.jsx";
import DayList from "../components/DayList.jsx"; 
import styles from "./MainScreen.module.css";
import { useAuth } from "../contexts/AuthContext.jsx";
import api from "../api.js";

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

  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [selectedDiary, setSelectedDiary] = useState(null);

  const [title, setTitle] = useState("");
  const [code, setCode] = useState("");
  const [desc, setDesc] = useState("");
  const [category, setCategory] = useState("CATEGORY");
  const [hashtags, setHashtags] = useState([]);

  const [waveCount, setWaveCount] = useState(0);
  const [bookmarkCount, setBookmarkCount] = useState(0);

  const [selectedDate, setSelectedDate] = useState("2025-07-13");

  const [diaries, setDiaries] = useState([]);

  const userId = localStorage.getItem("userId");
  const token = localStorage.getItem("token");

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
      .catch(() => {
        setWaveCount(0);
      });

    api
      .get(`/diaries/bookmark/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setBookmarkCount(res.data.count ?? 0);
      })
      .catch(() => {
        setBookmarkCount(0);
      });
  }, [userId, token]);

  // 날짜 포맷 정리 (만약 '.' 있다면 '-'로 바꿈)
  const formattedDate = selectedDate.replace(/\./g, "-");

  useEffect(() => {
    if (!token) return;

    api
      .get(`/diaries?date=${formattedDate}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setDiaries(res.data))
      .catch(() => setDiaries([]));
  }, [formattedDate, token]);

  const getKey = (n) => {
    if (n < 5) return "0-4";
    if (n < 10) return "5-9";
    if (n < 15) return "10-14";
    if (n < 20) return "15-19";
    if (n < 25) return "20-24";
    return "25+";
  };
  const currentImages = imageSets[getKey(waveCount)];

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
  const openSearchModal = () => setIsSearchOpen(true);
  const closeSearchModal = () => setIsSearchOpen(false);
  const handleSave = (data) => {
    console.log("저장된 데이터:", data);
    closeEditModal();
  };

  const handleDateClick = (date) => {
    setSelectedDate(date);
  };

  return (
    <div className={styles.container}>
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

            <div className={styles.bookmarkWrapper}>
              <button
                className={styles.myButton}
                onClick={() => navigate("/bookmark")}
              >
                BOOKMARK
              </button>
              {bookmarkCount > 0 && (
                <span className={styles.badge}>{bookmarkCount}</span>
              )}
            </div>

            <button className={styles.myButton} onClick={openSearchModal}>
              SEARCH
            </button>
            <button className={styles.myButton} onClick={() => openEditModal()}>
              WRITE
            </button>
            <button className={styles.myButton} onClick={() => navigate("/quiz")}>
              QUIZ
            </button>
          </div>

          <div className={styles.rightMenuButton}>
            <button className={styles.myButton} onClick={handleLoginToggle}>
              {isLoggedIn ? "LOGOUT" : "LOGIN"}
            </button>
          </div>
        </div>
      </div>

      <div className={styles.rightSection}>
        <div className={styles.profileBox} onClick={goToProfile}>
          <img src={profileImg} alt="profile" className={styles.profileImg} />
        </div>

        <Calendar selectedDate={selectedDate} onSelect={handleDateClick} />

        <DayList selectedDate={selectedDate} />

        <div className={styles.diaryList}>
          {diaries.length === 0 ? (
            <p></p>
          ) : (
            diaries.map((diary) => (
              <div key={diary.id} className={styles.diaryCard}>
                <h3>{diary.title}</h3>
                <p>{diary.content}</p>
                <small>{diary.createdAt}</small>
              </div>
            ))
          )}
        </div>
      </div>

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

      {isSearchOpen && (
        <SearchModal isOpen={isSearchOpen} onClose={closeSearchModal} />
      )}
    </div>
  );
}
