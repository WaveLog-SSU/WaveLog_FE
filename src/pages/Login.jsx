import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import styles from "./Login.module.css";
import { useAuth } from "../contexts/AuthContext";

function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault(); // 폼 제출 시 페이지 리로드 방지

    if (!userId || !password) {
      alert("ID와 PW를 모두 입력해주세요.");
      return;
    }

    try {
      const response = await axios.post("http://localhost:8080/api/members/login", {
        wavelogId: userId,
        password: password,
      });

      const { accessToken, grantType, memberId } = response.data;
      localStorage.setItem("userId", `${memberId}`);
      localStorage.setItem("token", `${grantType} ${accessToken}`);

      login();
      alert("로그인 성공!");
      navigate("/");
    } catch (error) {
      console.error("로그인 실패:", error);
      alert("로그인 실패! 아이디 또는 비밀번호를 확인해주세요.");
    }
  };

  return (
    <div className={styles.screen}>
      <div className={styles.loginContainer}>
        <h1 className={styles.loginTitle}>WAVELOG</h1>

        <form onSubmit={handleLogin}>
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

          <button type="submit" className={styles.loginButton}>
            로그인
          </button>
        </form>

        <div className={styles.loginLinks}>
          <Link to="/signup">회원가입</Link>
        </div>
      </div>
    </div>
  );
}

export default Login;
