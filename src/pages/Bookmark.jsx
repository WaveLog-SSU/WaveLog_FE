// src/pages/BookmarkList.jsx
import React, { useEffect, useState } from "react";
import api from "../api";
import styles from "./Bookmark.module.css";

export default function Bookmark() {
  const [bookmarkedDiaries, setBookmarkedDiaries] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem('token');

  useEffect(() => {
  const fetchBookmarkedDiaries = async () => {

    if (!token) return;
    try {
      const res = await api.get("/bookmarks", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setBookmarkedDiaries(res.data);
      setLoading(false);
    } catch (err) {
      console.error("북마크 목록 불러오기 실패", err);
      setLoading(false);
    }
  };

  fetchBookmarkedDiaries();
}, [token]);


  if (loading) return <div className={styles.ListScreen}>로딩 중...</div>;

  if (bookmarkedDiaries.length === 0)
    return <div className={styles.ListScreen}>북마크한 글이 없습니다.</div>;

  return (
    <div className={styles.ListScreen}>
      <div className={styles.div}>
        <div className={styles.view}>
          <div className={styles.titleGroup}>
            <h2 className={styles.title}>내가 북마크한 글들</h2>
          </div>
        </div>

        <div className={styles.carouselWrapper}>
          <div className={styles.carousel}>
            {bookmarkedDiaries.map((diary) => (
              <div key={diary.id} className={styles.postCard}>
                <div className={styles.postTitle}>{diary.title}</div>
                <div className={styles.postDate}>
                  {new Date(diary.createdAt).toLocaleDateString()}
                </div>
                <div className={styles.postContent}>{diary.content}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
