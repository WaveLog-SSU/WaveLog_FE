// src/pages/Write.jsx
import React, { useState, useEffect, useContext } from "react";
import { useParams } from "react-router-dom";
import api from "../api";
import { DiaryContext } from "../contexts/DiaryContext";
import { highlight, languages } from "prismjs/components/prism-core";
import "prismjs/components/prism-clike";
import "prismjs/components/prism-javascript";
import styles from "./Write.module.css";

// 토큰 자동 부착
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});
console.log(localStorage.getItem("token"));


// 하트 아이콘
function Heart({ filled, count, onClick }) {
  return (
    <div className={styles.iconWrapper} onClick={onClick}>
      <svg
        className={styles.icon}
        xmlns="http://www.w3.org/2000/svg"
        fill={filled ? "red" : "none"}
        stroke="red"
        strokeWidth="2"
        viewBox="0 0 24 24"
      >
        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 
                 2 5.42 4.42 3 7.5 3c1.74 0 3.41 0.81 4.5 2.09
                 C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5
                 c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
      </svg>
      <span className={styles.iconText}>{count > 9999 ? "9999+" : count}</span>
    </div>
  );
}

// 북마크 아이콘
function Bookmark({ filled, count, onClick }) {
  return (
    <div className={styles.iconWrapper} onClick={onClick}>
      <svg
        className={styles.icon}
        xmlns="http://www.w3.org/2000/svg"
        fill={filled ? "#333" : "none"}
        stroke="#333"
        strokeWidth="2"
        viewBox="0 0 24 24"
      >
        <path d="M6 4v17l6-5 6 5V4z" />
      </svg>
      <span className={styles.iconText}>{count > 9999 ? "9999+" : count}</span>
    </div>
  );
}

export default function Write() {
  const { diaryId } = useParams();
  const { diaries } = useContext(DiaryContext);
  const diary = diaries.find((d) => d.id === Number(diaryId)) || {};
  const currentUserId = localStorage.getItem("currentUserId");

  const [comments, setComments] = useState([]);
  const [commentInput, setCommentInput] = useState("");
  const [replyInputs, setReplyInputs] = useState({});
  const [editStates, setEditStates] = useState({});
  const [editInputs, setEditInputs] = useState({});
  const [menuOpen, setMenuOpen] = useState({});

  const [heartCount, setHeartCount] = useState(diary.heartCount || 0);
  const [heartFilled, setHeartFilled] = useState(diary.heartedByCurrentUser || false);

  const [bookmarkCount, setBookmarkCount] = useState(diary.bookmarkCount || 0);
  const [bookmarkFilled, setBookmarkFilled] = useState(diary.bookmarkedByCurrentUser || false);
  const [bookmarkId, setBookmarkId] = useState(null);

  useEffect(() => {
    if (!diary.id) return;
    setHeartCount(diary.heartCount || 0);
    setHeartFilled(diary.heartedByCurrentUser || false);
    setBookmarkCount(diary.bookmarkCount || 0);
    setBookmarkFilled(diary.bookmarkedByCurrentUser || false);
    setBookmarkId(diary.bookmarkId || null);

    api
      .get(`/diaries/${diary.id}/comments`)
      .then((res) => setComments(res.data))
      .catch(console.error);
  }, [diary]);

  const toggleHeart = async () => {
    try {
      const res = await api.post("/likes/add", { diaryId: diary.id });
      setHeartCount(res.data.heartCount ?? heartCount);
      setHeartFilled(res.data.heartedByCurrentUser ?? !heartFilled);
    } catch (err) {
      if (err.response?.status === 401) {
        alert("로그인이 필요합니다.");
      }
      console.error("좋아요 실패:", err);
    }
  };

  const toggleBookmark = async () => {
    try {
      if (bookmarkFilled) {
        if (!bookmarkId) {
          console.warn("북마크 ID 없음 - 삭제 불가");
          return;
        }
        const res = await api.delete(`/bookmarks/${bookmarkId}`);
        setBookmarkFilled(false);
        setBookmarkCount(res.data.bookmarkCount ?? bookmarkCount - 1);
        setBookmarkId(null);
      } else {
        const res = await api.post("/bookmarks", { diaryId: diary.id });
        setBookmarkFilled(true);
        setBookmarkCount(res.data.bookmarkCount ?? bookmarkCount + 1);
        setBookmarkId(res.data.id);
      }
    } catch (err) {
      if (err.response?.status === 401) {
        alert("로그인이 필요합니다.");
      }
      console.error("북마크 실패:", err);
    }
  };

  const handleCommentSubmit = async () => {
    if (!commentInput.trim()) return;
    try {
      const res = await api.post(`/diaries/${diary.id}/comments`, {
        content: commentInput,
      });
      setComments([...comments, res.data]);
      setCommentInput("");
    } catch (err) {
      if (err.response?.status === 401) {
        alert("로그인이 필요합니다.");
      }
      console.error("댓글 작성 실패:", err);
    }
  };

  const formatDate = (iso) => {
    if (!iso) return "";
    const d = new Date(iso);
    const yy = String(d.getFullYear()).slice(-2);
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const dd = String(d.getDate()).padStart(2, "0");
    return `${yy}.${mm}.${dd}`;
  };

  const topLevel = comments.filter((c) => c.parentCommentId == null);
  const getReplies = (id) => comments.filter((c) => c.parentCommentId === id);

  if (!diary.id) {
    return <div className={styles.notFound}>다이어리를 찾을 수 없습니다.</div>;
  }

  return (
    <div className={styles.page}>
      {/* 좌측 코드 박스 */}
      <div className={styles.leftPanel}>
        <pre
          className={styles.codeBlock}
          dangerouslySetInnerHTML={{
            __html: highlight(diary.code || "", languages.js),
          }}
        />
      </div>

      {/* 우측: 정보 + 하트 + 북마크 + 댓글 */}
      <div className={styles.rightPanel}>
        <div className={styles.titleRow}>
          <h1 className={styles.title}>{diary.title}</h1>
          <span className={styles.category}>{diary.category}</span>
        </div>
        <div className={styles.date}>{formatDate(diary.createdAt)}</div>
        <div className={styles.infoCard}>
          <p className={styles.description}>{diary.content}</p>
          <p className={styles.hashtags}>
            {diary.hashtags?.map((h) => `#${h}`).join(" ")}
          </p>
        </div>
        <div className={styles.iconRow}>
          <Heart filled={heartFilled} count={heartCount} onClick={toggleHeart} />
          <Bookmark filled={bookmarkFilled} count={bookmarkCount} onClick={toggleBookmark} />
        </div>

        {/* 댓글 섹션 */}
        <div className={styles.commentSection}>
          <h3>댓글</h3>
          <div className={styles.commentInputRow}>
            <textarea
              value={commentInput}
              onChange={(e) => setCommentInput(e.target.value)}
              placeholder="댓글을 입력하세요"
              className={styles.commentInput}
            />
            <button onClick={handleCommentSubmit} className={styles.commentButton}>
              등록
            </button>
          </div>
          <ul className={styles.commentList}>
            {topLevel.map((comment) => (
              <li key={comment.id} className={styles.commentItem}>
                <div>
                  <strong>{comment.authorName}</strong>
                  <span className={styles.commentDate}>{formatDate(comment.createdAt)}</span>
                </div>
                <div>{comment.content}</div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
