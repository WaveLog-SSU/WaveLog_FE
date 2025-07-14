import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import styles from "./Signup.module.css";

const profileImageUrls = [
  "https://i.postimg.cc/rmHDSxQ5/Kakao-Talk-20250710-232308800-04.jpg",
  "https://i.postimg.cc/HWJ2F2DD/Kakao-Talk-20250710-232308800-01.jpg",
  "https://i.postimg.cc/K4S4WFXz/Kakao-Talk-20250710-232308800-02.jpg",
  "https://i.postimg.cc/3NDd9NcV/Kakao-Talk-20250710-232308800-03.jpg",
  "https://i.postimg.cc/9fJRQv98/Kakao-Talk-20250710-232308800.jpg"
];

function Signup() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [nickname, setNickname] = useState("");
  const [introIndex, setIntroIndex] = useState("");
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const [passwordCheck, setPasswordCheck] = useState("");
  const [selectedImage, setSelectedImage] = useState("");
  const [showModal, setShowModal] = useState(false);

  const handleImageSelect = (url) => {
    setSelectedImage(url);
    setShowModal(false);
  };

  const handleSignup = async () => {
    if (!name || !nickname || !introIndex || !userId || !password || !passwordCheck || !selectedImage) {
      alert("모든 항목을 입력해주세요.");
      return;
    }

    if (password !== passwordCheck) {
      alert("비밀번호가 일치하지 않습니다.");
      return;
    }

    try {
      const response = await axios.post("http://localhost:8080/api/members/register", {
        wavelogId: userId,
        name,
        password,
        nickname,
        profileImageUrl: selectedImage,
        introIndex,
      });

      if (response.status === 201) {
        alert("회원가입 성공! 로그인 페이지로 이동합니다.");
        navigate("/login");
      }
    } catch (error) {
      alert("회원가입 실패! 입력값을 확인해주세요.");
      console.error("Signup error:", error);
    }
  };

  return (
    <div className={styles.screen}>
      <div className={styles.signupContainer}>
        <div className={styles.title}>회원가입</div>

        <div className={styles.inputBox}>
          <div className={styles.overlapGroup}>
            <label className={styles.textWrapper}>이름</label>
            <input
              type="text"
              className={styles.input}
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
        </div>

        <div className={styles.inputBox}>
          <div className={styles.overlapGroup}>
            <label className={styles.textWrapper}>닉네임</label>
            <input
              type="text"
              className={styles.input}
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
            />
          </div>
        </div>

        <div className={styles.inputBox}>
          <div className={styles.overlapGroup}>
            <label className={styles.textWrapper}>한 줄 소개</label>
            <input
              type="text"
              className={styles.input}
              value={introIndex}
              onChange={(e) => setIntroIndex(e.target.value)}
            />
          </div>
        </div>

        <div className={styles.inputBox}>
          <div className={styles.overlapGroup}>
            <label className={styles.textWrapper}>아이디</label>
            <div className={styles.idRow}>
              <input
                type="text"
                className={styles.input}
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
              />
              <button className={styles.checkButton}>중복확인</button>
            </div>
          </div>
        </div>

        <div className={styles.inputBox}>
          <div className={styles.overlapGroup}>
            <label className={styles.textWrapper}>비밀번호</label>
            <input
              type="password"
              className={styles.input}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
        </div>

        <div className={styles.inputBox}>
          <div className={styles.overlapGroup}>
            <label className={styles.textWrapper}>비밀번호 확인</label>
            <input
              type="password"
              className={styles.input}
              value={passwordCheck}
              onChange={(e) => setPasswordCheck(e.target.value)}
            />
          </div>
        </div>

        {/* 프로필 이미지 선택 영역 */}
        <div className={styles.inputBox}>
          <div className={styles.overlapGroup}>
            <label className={styles.textWrapper}>프로필 이미지</label>
            <button type="button" className={styles.imageSelectButton} onClick={() => setShowModal(true)}>
              프로필 선택
            </button>
            {selectedImage && (
              <div className={styles.previewBox}>
                <img src={selectedImage} alt="선택된 이미지" width="80" />
              </div>
            )}
          </div>
        </div>

        <div className={styles.buttonBox}>
          <button className={styles.signupButton} onClick={handleSignup}>
            가입하기
          </button>
        </div>
      </div>

      {/* 프로필 이미지 선택 모달 */}
      {showModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <h3>프로필 이미지 선택</h3>
            <div className={styles.imageGrid}>
              {profileImageUrls.map((url) => (
                <img
                  key={url}
                  src={url}
                  alt="프로필"
                  className={styles.imageOption}
                  onClick={() => handleImageSelect(url)}
                />
              ))}
            </div>
            <button className={styles.closeButton} onClick={() => setShowModal(false)}>
              닫기
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Signup;
