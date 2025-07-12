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

// 하트 아이콘
function Heart({ filled, onClick }) {
  return (
    <svg
      onClick={onClick}
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
  );
}

export default function Write() {
  const { diaryId } = useParams();
  const { diaries } = useContext(DiaryContext);
  const diary = diaries.find((d) => d.id === Number(diaryId)) || {};
  const currentUserId = localStorage.getItem("currentUserId");

  // 댓글/대댓글 상태
  const [comments, setComments] = useState([]);
  const [commentInput, setCommentInput] = useState("");
  const [replyInputs, setReplyInputs] = useState({});
  const [editStates, setEditStates] = useState({});
  const [editInputs, setEditInputs] = useState({});
  const [menuOpen, setMenuOpen] = useState({});

  // 하트 상태
  const [heartCount, setHeartCount] = useState(diary.heartCount || 0);
  const [heartFilled, setHeartFilled] = useState(
    diary.heartedByCurrentUser || false
  );

  // 다이어리 바뀌면: 댓글 로드 + 하트 초기화
  useEffect(() => {
    if (!diary.id) return;
    setHeartCount(diary.heartCount || 0);
    setHeartFilled(diary.heartedByCurrentUser || false);

    api
      .get(`/diaries/${diary.id}/comments`)
      .then((res) => setComments(res.data))
      .catch(console.error);
  }, [diary]);

  // 댓글 작성
  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    const txt = commentInput.trim();
    if (!txt) return;
    try {
      const res = await api.post(`/diaries/${diary.id}/comments`, {
        content: txt,
      });
      setComments((p) => [...p, res.data]);
      setCommentInput("");
    } catch (err) {
      console.error(err);
    }
  };

  // 대댓글 작성
  const handleReplySubmit = async (e, parentId) => {
    e.preventDefault();
    const txt = (replyInputs[parentId] || "").trim();
    if (!txt) return;
    try {
      const res = await api.post(`/diaries/${diary.id}/comments`, {
        content: txt,
        parentCommentId: parentId,
      });
      setComments((p) => [...p, res.data]);
      setReplyInputs((p) => ({ ...p, [parentId]: "" }));
    } catch (err) {
      console.error(err);
    }
  };

  // 수정하기 시작
  const handleEditStart = (id, content) => {
    setEditStates((p) => ({ ...p, [id]: true }));
    setEditInputs((p) => ({ ...p, [id]: content }));
    setMenuOpen((p) => ({ ...p, [id]: false }));
  };
  // 수정 제출
  const handleEditSubmit = async (id) => {
    const txt = (editInputs[id] || "").trim();
    if (!txt) return;
    try {
      const res = await api.put(`/comments/${id}`, { content: txt });
      setComments((p) => p.map((c) => (c.id === id ? res.data : c)));
      setEditStates((p) => ({ ...p, [id]: false }));
    } catch (err) {
      console.error(err);
    }
  };

  // 삭제
  const handleDelete = async (id) => {
    if (!window.confirm("댓글을 삭제하시겠습니까?")) return;
    try {
      await api.delete(`/comments/${id}`);
      setComments((p) =>
        p.filter((c) => c.id !== id && c.parentCommentId !== id)
      );
      setMenuOpen((p) => ({ ...p, [id]: false }));
    } catch (err) {
      console.error(err);
    }
  };

  const toggleMenu = (id) =>
    setMenuOpen((p) => ({ ...p, [id]: !p[id] }));

  // 최상위/대댓글 분리
  const topLevel = comments.filter((c) => c.parentCommentId == null);
  const getReplies = (id) =>
    comments.filter((c) => c.parentCommentId === id);

  // 날짜 포맷
  const formatDate = (iso) => {
    if (!iso) return "";
    const d = new Date(iso);
    const yy = String(d.getFullYear()).slice(-2);
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const dd = String(d.getDate()).padStart(2, "0");
    return `${yy}.${mm}.${dd}`;
  };

  if (!diary.id) {
    return <div className={styles.notFound}>다이어리를 찾을 수 없습니다.</div>;
  }

  return (
    <div className={styles.page}>
      {/* 좌측: 코드 박스 */}
      <div className={styles.leftPanel}>
        <pre
          className={styles.codeBlock}
          dangerouslySetInnerHTML={{
            __html: highlight(diary.code || "", languages.js),
          }}
        />
      </div>

      {/* 우측: 정보 + 하트 + 댓글 */}
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
          <Heart filled={heartFilled} onClick={() => {
            setHeartFilled(!heartFilled);
            setHeartCount((c) => (heartFilled ? c - 1 : c + 1));
          }} />
          <span className={styles.iconText}>
            {heartCount > 9999 ? "9999+" : heartCount}
          </span>
        </div>

        {/* 댓글 입력폼 */}
        <form onSubmit={handleCommentSubmit} className={styles.commentForm}>
          <input
            type="text"
            className={styles.commentInput}
            placeholder="댓글을 입력하세요"
            value={commentInput}
            onChange={(e) => setCommentInput(e.target.value)}
          />
          <button type="submit" className={styles.commentBtn}>
            작성
          </button>
        </form>

        {/* 댓글 리스트 */}
        <div className={styles.commentList}>
          {topLevel.map((c) => (
            <div key={c.id} className={styles.commentItem}>
              <div className={styles.commentHeader}>
                <span className={styles.commentAuthor}>{c.writerNickname}</span>
                <span className={styles.commentDate}>
                  {formatDate(c.createdAt)}
                </span>
                {c.writerId === currentUserId && (
                  <button
                    className={styles.menuBtn}
                    onClick={() => toggleMenu(c.id)}
                  >
                    ⋯
                  </button>
                )}
                {menuOpen[c.id] && (
                  <div className={styles.menu}>
                    <button onClick={() => handleEditStart(c.id, c.content)}>
                      수정
                    </button>
                    <button onClick={() => handleDelete(c.id)}>삭제</button>
                  </div>
                )}
              </div>

              {editStates[c.id] ? (
                <div className={styles.editBox}>
                  <input
                    className={styles.editInput}
                    value={editInputs[c.id]}
                    onChange={(e) =>
                      setEditInputs((p) => ({ ...p, [c.id]: e.target.value }))
                    }
                  />
                  <button
                    className={styles.editBtn}
                    onClick={() => handleEditSubmit(c.id)}
                  >
                    저장
                  </button>
                </div>
              ) : (
                <p className={styles.commentText}>{c.content}</p>
              )}

              {/* 대댓글 */}
              <div className={styles.replyList}>
                {getReplies(c.id).map((r) => (
                  <div key={r.id} className={styles.replyItem}>
                    <span className={styles.commentAuthor}>
                      {r.writerNickname}
                    </span>
                    <span className={styles.commentDate}>
                      {formatDate(r.createdAt)}
                    </span>
                    <p className={styles.commentText}>{r.content}</p>
                  </div>
                ))}
              </div>
              <form
                onSubmit={(e) => handleReplySubmit(e, c.id)}
                className={styles.replyForm}
              >
                <input
                  type="text"
                  className={styles.replyInput}
                  placeholder="답글을 입력하세요"
                  value={replyInputs[c.id] || ""}
                  onChange={(e) =>
                    setReplyInputs((p) => ({ ...p, [c.id]: e.target.value }))
                  }
                />
                <button type="submit" className={styles.replyBtn}>
                  답글
                </button>
              </form>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
