import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Calendar from "../components/Calendar";
import EditModal from "../components/EditModal";
import styles from "./MainScreen.module.css";
import { useAuth } from "../contexts/AuthContext";

const profileImg =
  "https://storage.googleapis.com/tagjs-prod.appspot.com/v1/Pj2S5T474o/ir4t7nuw_expires_30_days.png";

function MainScreen() {
  const navigate = useNavigate();
  const { isLoggedIn, logout } = useAuth();

  const [modalOpen, setModalOpen] = useState(false);
  const [selectedDiaryId, setSelectedDiaryId] = useState(null);
  const [title, setTitle] = useState("");
  const [code, setCode] = useState("");
  const [desc, setDesc] = useState("");
  const [category, setCategory] = useState("CATEGORY");
  const [hashtags, setHashtags] = useState([]);

  const goToProfile = () => {
    navigate("/profile");
  };

  // 로그아웃 시 alert 띄우고 로그인 페이지로 이동
  const handleLoginToggle = () => {
    if (isLoggedIn) {
      logout(); // 로그아웃 처리
      alert("로그아웃 되었습니다."); // 팝업창
      navigate("/login"); // 로그인 페이지로 이동
    } else {
      navigate("/login");
    }
  };

  const openModal = (diary = null) => {
    if (diary) {
      setSelectedDiaryId(diary.diary_id);
      setTitle(diary.title);
      setCode(diary.code);
      setDesc(diary.content);
      setCategory(diary.category);
      setHashtags(diary.hashtags || []);
    } else {
      setSelectedDiaryId(null);
      setTitle("");
      setCode("");
      setDesc("");
      setCategory("CATEGORY");
      setHashtags([]);
    }
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
  };

  const handleSave = (data) => {
    console.log("저장된 데이터:", data);
    closeModal();
  };

  return (
    <div className={styles.container}>
      {/* 왼쪽 섹션: 메뉴 + 콘텐츠 박스 */}
      <div className={styles.leftSection}>
        {/* 상단 메뉴: 왼쪽 버튼들과 오른쪽 로그인 버튼 */}
        <div className={styles.topTextMenu}>
          <div className={styles.leftMenuGroup}>
            <button className={styles.myButton} onClick={() => navigate("/list")}>
              LIST
            </button>
            <button className={styles.myButton} onClick={() => navigate("/bookmark")}>
              BOOKMARK
            </button>
            <button className={styles.myButton} onClick={() => navigate("/search")}>
              SEARCH
            </button>
            <button className={styles.myButton} onClick={() => openModal()}>
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

      {/* 오른쪽 섹션: 프로필 이미지 + 캘린더 */}
      <div className={styles.rightSection}>
        <div className={styles.profileBox} onClick={goToProfile}>
          <img src={profileImg} alt="profile" className={styles.profileImg} />
        </div>
        <Calendar />
      </div>

      {/* 모달: 편집 데이터와 함께 호출 */}
      <EditModal
        isOpen={modalOpen}
        onClose={closeModal}
        onSave={handleSave}
        diaryId={selectedDiaryId}
        initialTitle={title}
        initialCode={code}
        initialDesc={desc}
        initialCategory={category}
        initialHashtags={hashtags}
      />
    </div>
  );
}

export default MainScreen;
