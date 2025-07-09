import styles from "./Write.module.css";
import React, { useState, useEffect } from "react";

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

function Scrap({ diaryId }) {
  const [heartCount, setHeartCount] = useState(0);
  const [heartFilled, setHeartFilled] = useState(false);
  const [comments, setComments] = useState([]);
  const [commentInput, setCommentInput] = useState("");
  const [replyInputs, setReplyInputs] = useState({});
  const [editStates, setEditStates] = useState({});
  const [editInputs, setEditInputs] = useState({});
  const [menuOpen, setMenuOpen] = useState({});

  const currentUserId = "어드민";

  // API 함수들
  async function fetchComments(diaryId) {
    const res = await fetch(`/api/diaries/${diaryId}/comments`);
    if (!res.ok) throw new Error("댓글을 불러오는데 실패했습니다.");
    const data = await res.json();
    return data;
  }

  async function postComment(diaryId, content, parentCommentId = null) {
    const res = await fetch(`/api/diaries/${diaryId}/comments`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content, parentCommentId }),
    });
    if (!res.ok) throw new Error("댓글 작성 실패");
    return await res.json();
  }

  async function updateComment(commentId, newContent) {
    const res = await fetch(`/api/comments/${commentId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content: newContent }),
    });
    if (!res.ok) throw new Error("댓글 수정 실패");
    return await res.json();
  }

  async function deleteComment(commentId) {
    const res = await fetch(`/api/comments/${commentId}`, {
      method: "DELETE",
    });
    if (!res.ok) throw new Error("댓글 삭제 실패");
  }

  // 하트 상태 초기화 (localStorage)
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

  // 댓글 목록 불러오기
  useEffect(() => {
    if (!diaryId) return;
    fetchComments(diaryId)
      .then((data) => setComments(data))
      .catch((e) => console.error(e));
  }, [diaryId]);

  const handleHeartClick = () => {
    const updatedFilled = !heartFilled;
    const updatedCount = updatedFilled ? heartCount + 1 : heartCount - 1;

    setHeartFilled(updatedFilled);
    setHeartCount(updatedCount);
    localStorage.setItem("heartFilled", updatedFilled.toString());
    localStorage.setItem("heartCount", updatedCount.toString());
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!commentInput.trim()) return;

    try {
      const newComment = await postComment(diaryId, commentInput.trim());
      setComments((prev) => [...prev, newComment]);
      setCommentInput("");
    } catch (e) {
      alert(e.message);
    }
  };

  const handleReplyChange = (commentId, value) => {
    setReplyInputs((prev) => ({ ...prev, [commentId]: value }));
  };

  const handleReplySubmit = async (e, parentId) => {
    e.preventDefault();
    const replyText = replyInputs[parentId];
    if (!replyText?.trim()) return;

    try {
      const newReply = await postComment(diaryId, replyText.trim(), parentId);
      setComments((prev) => [...prev, newReply]);
      setReplyInputs((prev) => ({ ...prev, [parentId]: "" }));
    } catch (e) {
      alert(e.message);
    }
  };

  const handleEdit = (commentId, content) => {
    setEditStates((prev) => ({ ...prev, [commentId]: true }));
    setEditInputs((prev) => ({ ...prev, [commentId]: content }));
    setMenuOpen((prev) => ({ ...prev, [commentId]: false }));
  };

  const handleEditChange = (commentId, value) => {
    setEditInputs((prev) => ({ ...prev, [commentId]: value }));
  };

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

  const toggleMenu = (commentId) => {
    setMenuOpen((prev) => ({
      ...prev,
      [commentId]: !prev[commentId],
    }));
  };

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
              style={{
                marginTop: "10px",
                display: "flex",
                alignItems: "center",
              }}
            >
              <Heart filled={heartFilled} onClick={handleHeartClick} />
              <span
                style={{
                  fontSize: "20px",
                  fontWeight: "bold",
                  marginRight: "10px",
                }}
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

            {/* 댓글 목록 */}
            <div className={styles.commentList}>
              {topLevelComments.map((c) => (
                <div key={c.id} className={styles.commentItem}>
                  <div className={styles.commentHeader}>
                    <strong className={styles.commentAuthor}>{c.name}</strong>
                    {editStates[c.id] ? (
                      <>
                        <input
                          type="text"
                          value={editInputs[c.id] || ""}
                          onChange={(e) => handleEditChange(c.id, e.target.value)}
                          className={styles.editInput}
                        />
                        <button
                          onClick={() => handleEditSubmit(c.id)}
                          className={styles.editBtn}
                        >
                          완료
                        </button>
                      </>
                    ) : (
                      <>
                        <span className={styles.commentContent}>{c.content}</span>
                        {c.name === currentUserId && (
                          <div className={styles.menuWrapper}>
                            <button
                              onClick={() => toggleMenu(c.id)}
                              className={styles.menuBtn}
                            >
                              ...
                            </button>
                            {menuOpen[c.id] && (
                              <div className={styles.menuBox}>
                                <button
                                  onClick={() => handleEdit(c.id, c.content)}
                                  className={styles.menuOption}
                                >
                                  수정
                                </button>
                                <button
                                  onClick={() => handleDelete(c.id)}
                                  className={styles.menuOption}
                                >
                                  삭제
                                </button>
                              </div>
                            )}
                          </div>
                        )}
                      </>
                    )}
                  </div>

                  {/* 대댓글 목록 */}
                  <div className={styles.replyList}>
                    {getReplies(c.id).map((r) => (
                      <div key={r.id} className={styles.replyItem}>
                        <strong className={styles.commentAuthor}>{r.name}</strong>
                        {editStates[r.id] ? (
                          <>
                            <input
                              type="text"
                              value={editInputs[r.id] || ""}
                              onChange={(e) => handleEditChange(r.id, e.target.value)}
                              className={styles.editInput}
                            />
                            <button
                              onClick={() => handleEditSubmit(r.id)}
                              className={styles.editBtn}
                            >
                              완료
                            </button>
                          </>
                        ) : (
                          <>
                            <span className={styles.commentContent}>{r.content}</span>
                            {r.name === currentUserId && (
                              <div className={styles.menuWrapper}>
                                <button
                                  onClick={() => toggleMenu(r.id)}
                                  className={styles.menuBtn}
                                >
                                  ...
                                </button>
                                {menuOpen[r.id] && (
                                  <div className={styles.menuBox}>
                                    <button
                                      onClick={() => handleEdit(r.id, r.content)}
                                      className={styles.menuOption}
                                    >
                                      수정
                                    </button>
                                    <button
                                      onClick={() => handleDelete(r.id)}
                                      className={styles.menuOption}
                                    >
                                      삭제
                                    </button>
                                  </div>
                                )}
                              </div>
                            )}
                          </>
                        )}
                      </div>
                    ))}

                    {/* 대댓글 입력폼 */}
                    <form
                      onSubmit={(e) => handleReplySubmit(e, c.id)}
                      className={styles.replyForm}
                    >
                      <input
                        type="text"
                        placeholder="답글 작성"
                        value={replyInputs[c.id] || ""}
                        onChange={(e) => handleReplyChange(c.id, e.target.value)}
                        className={styles.replyInput}
                      />
                      <button type="submit" className={styles.replyBtn}>
                        작성
                      </button>
                    </form>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Scrap;
