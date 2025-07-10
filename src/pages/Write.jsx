import styles from "./Write.module.css";
import React, { useState, useEffect } from "react";
import api from "../api";

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = token;
  }
  return config;
});

function Heart({ filled, onClick }) {
  return (
    <svg
      onClick={onClick}
      xmlns="http://www.w3.org/2000/svg"
      fill={filled ? "red" : "none"}
      stroke="red"
      strokeWidth="2"
      viewBox="0 0 24 24"
      width="45px"
      height="45px"
      style={{ cursor: "pointer", marginRight: "18px" }}
    >
      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 
               2 5.42 4.42 3 7.5 3c1.74 0 3.41 0.81 4.5 2.09
               C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5
               c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
    </svg>
  );
}

function Write({ diaryId }) {
  console.log("diaryId:", diaryId); // diaryId 확인용

  // 상태 관리
  const [heartCount, setHeartCount] = useState(0);
  const [heartFilled, setHeartFilled] = useState(false);
  const [comments, setComments] = useState([]);
  const [commentInput, setCommentInput] = useState("");
  const [replyInputs, setReplyInputs] = useState({});
  const [editStates, setEditStates] = useState({});
  const [editInputs, setEditInputs] = useState({});
  const [menuOpen, setMenuOpen] = useState({});

  const currentUserId = localStorage.getItem("currentUserId");

  // 댓글 불러오기
  async function fetchComments(diaryId) {
    if (!diaryId) return [];
    try {
      const res = await api.get(`/diaries/${diaryId}/comments`);
      return res.data;
    } catch (error) {
      console.error("댓글을 불러오는데 실패했습니다.", error);
      return [];
    }
  }

  // 댓글 작성
  async function postComment(diaryId, content, parentCommentId = null) {
    try {
      const res = await api.post(`/diaries/${diaryId}/comments`, {
        content,
        parentCommentId,
      });
      return res.data;
    } catch {
      throw new Error("댓글 작성 실패");
    }
  }

  // 댓글 수정
  async function updateComment(commentId, newContent) {
    try {
      const res = await api.put(`/comments/${commentId}`, {
        content: newContent,
      });
      return res.data;
    } catch {
      throw new Error("댓글 수정 실패");
    }
  }

  // 댓글 삭제
  async function deleteComment(commentId) {
    try {
      await api.delete(`/comments/${commentId}`);
    } catch {
      throw new Error("댓글 삭제 실패");
    }
  }

  // 처음 마운트 시 하트 상태 불러오기
  useEffect(() => {
    const storedHeartCount = localStorage.getItem("heartCount");
    const storedHeartFilled = localStorage.getItem("heartFilled");

    if (storedHeartCount !== null) {
      setHeartCount(parseInt(storedHeartCount, 10));
    }
    if (storedHeartFilled !== null) {
      setHeartFilled(storedHeartFilled === "true");
    }
  }, []);

  // diaryId가 바뀔 때 댓글 불러오기
  useEffect(() => {
    if (!diaryId) return;

    fetchComments(diaryId)
      .then(setComments)
      .catch(console.error);
  }, [diaryId]);

  if (!diaryId) {
    return <div>다이어리를 찾을 수 없습니다. ID가 올바르지 않습니다.</div>;
  }

  // 하트 클릭 핸들러
  const handleHeartClick = () => {
    const updatedFilled = !heartFilled;
    const updatedCount = updatedFilled ? heartCount + 1 : heartCount - 1;

    setHeartFilled(updatedFilled);
    setHeartCount(updatedCount);

    localStorage.setItem("heartFilled", updatedFilled.toString());
    localStorage.setItem("heartCount", updatedCount.toString());
  };

  // 댓글 작성 폼 제출
  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    const text = commentInput.trim();
    if (!text || !diaryId) return;

    try {
      const newComment = await postComment(diaryId, text);
      setComments((prev) => [...prev, newComment]);
      setCommentInput("");
    } catch (err) {
      console.error("댓글 작성 실패:", err);
    }
  };

  // 대댓글 입력 변경
  const handleReplyChange = (commentId, value) => {
    setReplyInputs((prev) => ({ ...prev, [commentId]: value }));
  };

  // 대댓글 작성 제출
  const handleReplySubmit = async (e, parentId) => {
    e.preventDefault();
    const replyText = replyInputs[parentId];
    if (!replyText?.trim() || !diaryId) return;

    try {
      const newReply = await postComment(diaryId, replyText.trim(), parentId);
      setComments((prev) => [...prev, newReply]);
      setReplyInputs((prev) => ({ ...prev, [parentId]: "" }));
    } catch (e) {
      alert(e.message);
    }
  };

  // 댓글 수정 모드 시작
  const handleEdit = (commentId, content) => {
    setEditStates((prev) => ({ ...prev, [commentId]: true }));
    setEditInputs((prev) => ({ ...prev, [commentId]: content }));
    setMenuOpen((prev) => ({ ...prev, [commentId]: false }));
  };

  // 댓글 수정 입력 변경
  const handleEditChange = (commentId, value) => {
    setEditInputs((prev) => ({ ...prev, [commentId]: value }));
  };

  // 댓글 수정 제출
  const handleEditSubmit = async (commentId) => {
    const newContent = editInputs[commentId]?.trim();
    if (!newContent) return;

    try {
      const updatedComment = await updateComment(commentId, newContent);
      setComments((prev) =>
        prev.map((c) => (c.id === commentId ? updatedComment : c))
      );
      setEditStates((prev) => ({ ...prev, [commentId]: false }));
    } catch (e) {
      alert(e.message);
    }
  };

  // 댓글 삭제
  const handleDelete = async (commentId) => {
    if (!window.confirm("댓글을 삭제하시겠습니까?")) return;
    try {
      await deleteComment(commentId);
      setComments((prev) =>
        prev.filter((c) => c.id !== commentId && c.parentCommentId !== commentId)
      );
      setMenuOpen((prev) => ({ ...prev, [commentId]: false }));
    } catch (e) {
      alert(e.message);
    }
  };

  // 메뉴 토글
  const toggleMenu = (commentId) => {
    setMenuOpen((prev) => ({
      ...prev,
      [commentId]: !prev[commentId],
    }));
  };

  // 최상위 댓글 필터링 및 대댓글 조회 함수
  const topLevelComments = comments.filter((c) => c.parentCommentId === null);
  const getReplies = (commentId) =>
    comments.filter((c) => c.parentCommentId === commentId);

  return (
    <div className={styles.contain}>
      <div className={styles["scroll-view"]}>
        <div className={styles.view}>
          <span className={styles.text}>SCRAP</span>
        </div>

        <div className={styles["row-view"]}>
          <div className={styles.view2}>
            <span className={styles.text2}>frintf...</span>
          </div>

          <div className={styles.column}>
            <span className={styles.text3}>CATEGORY</span>
            <span className={styles.text4}>YY.MM.DD</span>

            <input placeholder="하하하" className={styles.input} readOnly />

            <div
              style={{ marginTop: "10px", display: "flex", alignItems: "center" }}
            >
              <Heart filled={heartFilled} onClick={handleHeartClick} />
              <span
                style={{ fontSize: "20px", fontWeight: "bold", marginRight: "10px" }}
              >
                {heartCount}
              </span>
            </div>

            {/* 댓글 입력폼 */}
            <form onSubmit={handleCommentSubmit} className={styles.commentForm}>
              <input
                type="text"
                placeholder="댓글 작성"
                value={commentInput}
                onChange={(e) => setCommentInput(e.target.value)}
                className={styles.commentInput}
              />
              <button type="submit" className={styles.commentBtn}>
                작성
              </button>
            </form>

            {/* 댓글 리스트 */}
            <div>
              {topLevelComments.map((comment) => (
                <div key={comment.id} className={styles.commentBox}>
                  <div className={styles.commentHeader}>
                    <span>{comment.writerNickname}</span>
                    <span>{comment.createdAt}</span>
                    <button onClick={() => toggleMenu(comment.id)}>…</button>
                    {menuOpen[comment.id] && (
                      <div className={styles.commentMenu}>
                        {currentUserId === comment.writerId && (
                          <>
                            <button
                              onClick={() => handleEdit(comment.id, comment.content)}
                            >
                              수정
                            </button>
                            <button onClick={() => handleDelete(comment.id)}>
                              삭제
                            </button>
                          </>
                        )}
                      </div>
                    )}
                  </div>

                  {editStates[comment.id] ? (
                    <>
                      <input
                        value={editInputs[comment.id]}
                        onChange={(e) => handleEditChange(comment.id, e.target.value)}
                        className={styles.editInput}
                      />
                      <button onClick={() => handleEditSubmit(comment.id)}>저장</button>
                    </>
                  ) : (
                    <p>{comment.content}</p>
                  )}

                  {/* 대댓글 리스트 */}
                  {getReplies(comment.id).map((reply) => (
                    <div key={reply.id} className={styles.replyBox}>
                      <span>{reply.writerNickname}</span>
                      <span>{reply.createdAt}</span>
                      <p>{reply.content}</p>
                    </div>
                  ))}

                  {/* 대댓글 입력폼 */}
                  <form
                    onSubmit={(e) => handleReplySubmit(e, comment.id)}
                    className={styles.replyForm}
                  >
                    <input
                      placeholder="답글 작성"
                      value={replyInputs[comment.id] || ""}
                      onChange={(e) => handleReplyChange(comment.id, e.target.value)}
                      className={styles.replyInput}
                    />
                    <button type="submit" className={styles.replyBtn}>
                      작성
                    </button>
                  </form>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Write;
