// src/contexts/DiaryContext.jsx

import React, { createContext, useContext, useState, useEffect } from "react";
import api from "../api";

export const DiaryContext = createContext({
  diaries: [],
  initDiaries: () => {},
  addDiary: () => {},
});

export function DiaryProvider({ children }) {
  // diaries 배열과 setter를 함께 선언
  const [diaries, setDiaries] = useState([]);

  // 초기 로드: 서버에서 받은 리스트로 덮어쓰기
  const initDiaries = (list) => {
    setDiaries(list);
  };

  // 새로운 다이어리 하나를 맨 앞에 추가
  const addDiary = (newDiary) => {
    setDiaries((prev) => [newDiary, ...prev]);
  };

  const userId = localStorage.getItem("userId");
  const token = localStorage.getItem("token");

  useEffect(() => {
    // 로그인 정보가 있을 때만 호출
    if (!userId || !token) return;

    api
      .get(`/diaries/members/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        // 서버에서 받은 전체 리스트를 initDiaries로 설정
        initDiaries(res.data);
      })
      .catch(console.error);
  }, [userId, token]);

  return (
    <DiaryContext.Provider value={{ diaries, initDiaries, addDiary }}>
      {children}
    </DiaryContext.Provider>
  );
}

// 편리한 훅
export function useDiaries() {
  return useContext(DiaryContext);
}
