import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import styles from "./Signup.module.css";

function Signup() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [nickname, setNickname] = useState("");
  const [introIndex, setIntroIndex] = useState("");
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const [passwordCheck, setPasswordCheck] = useState("");

  // 프로필 이미지 URL 기본값
  const profileImageUrl = "data:image/png;base64,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";

  const handleSignup = async () => {
    if (!name || !nickname || !introIndex || !userId || !password || !passwordCheck) {
      alert("모든 항목을 입력해주세요.");
      return;
    }

    if (password !== passwordCheck) {
      alert("비밀번호가 일치하지 않습니다.");
      return;
    }

    try {
      const response = await axios.post("/api/members/register", {
        wavelogId: userId,
        name,
        password,
        nickname,
        profileImageUrl,
        introIndex
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

        <div className={styles.buttonBox}>
          <button className={styles.signupButton} onClick={handleSignup}>
            가입하기
          </button>
        </div>
      </div>
    </div>
  );
}

export default Signup;
