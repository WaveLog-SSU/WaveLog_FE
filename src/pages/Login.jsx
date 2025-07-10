import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import styles from "./Login.module.css";

function Login() {
  const navigate = useNavigate();

  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    if (!userId || !password) {
      alert("ID와 PW를 모두 입력해주세요.");
      return;
    }

    try {
      const response = await axios.post("http://localhost:8080/api/members/login", {
        wavelogId: userId,
        password: password,
      });

      // 성공적으로 로그인하면 토큰 저장
      const { accessToken, grantType } = response.data;
      localStorage.setItem("token", `${grantType} ${accessToken}`);

      alert("로그인 성공!");
      navigate("/"); // 홈 화면으로 이동
    } catch (error) {
      console.error("로그인 실패:", error);
      alert("로그인 실패! 아이디 또는 비밀번호를 확인해주세요.");
    }
  };

  return (
    <div className={styles.screen}>
      <div className={styles.loginContainer}>
        <h1 className={styles.loginTitle}>WAVELOG</h1>

        <input
          type="text"
          placeholder="ID"
          className={styles.loginInput}
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
        />

        <input
          type="password"
          placeholder="PW"
          className={styles.loginInput}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button className={styles.loginButton} onClick={handleLogin}>
          로그인
        </button>

        <div className={styles.loginLinks}>
          <Link to="/signup">회원가입</Link>
        </div>
      </div>
    </div>
  );
}

export default Login;
