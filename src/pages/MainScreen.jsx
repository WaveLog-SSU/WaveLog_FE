import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Calendar from "../components/Calendar";
import EditModal from "../components/EditModal";  // 모달 임포트
import styles from "./MainScreen.module.css";

const profileImg =
  "https://storage.googleapis.com/tagjs-prod.appspot.com/v1/Pj2S5T474o/ir4t7nuw_expires_30_days.png";

function MainScreen() {
  const navigate = useNavigate();

  const [modalOpen, setModalOpen] = useState(false);

  const goToProfile = () => {
    navigate("/profile"); // 프로필 페이지로 이동
  };

  const openModal = () => {
    setModalOpen(true);
  };
  const closeModal = () => {
    setModalOpen(false);
  };

  const handleSave = (data) => {
    console.log("저장된 데이터:", data);
    // 여기서 저장 로직 추가 가능
    closeModal();
  };

  return (
    <div className={styles.container}>
      {/* 왼쪽 섹션: 메뉴 + 콘텐츠 박스 */}
      <div className={styles.leftSection}>
        <div className={styles.topMenu}>
          <button className={styles.menuItem}>SCRAP</button>
          <button className={styles.menuItem}>SEARCH</button>
          <button className={styles.menuItem} onClick={openModal}>
            +
          </button>
        </div>
      </div>

      <div className={styles.contentBox} />

      {/* 오른쪽 섹션: 프로필 이미지 + 캘린더 */}
      <div className={styles.rightSection}>
        <div className={styles.profileBox} onClick={goToProfile}>
          <img src={profileImg} alt="profile" className={styles.profileImg} />
        </div>
        <Calendar />
      </div>

      {/* 모달 */}
      <EditModal isOpen={modalOpen} onClose={closeModal} onSave={handleSave} />
    </div>
  );
}

export default MainScreen;
