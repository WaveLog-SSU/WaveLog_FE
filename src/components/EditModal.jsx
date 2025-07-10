import React, { useState, useEffect, useRef } from "react";
import styles from "./EditModal.module.css";
import api from "../api";

function InlineEditableCategory({ initialCategory, onCategoryChange }) {
  const [category, setCategory] = useState(initialCategory);
  const inputRef = useRef(null);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, []);

  useEffect(() => {
    setCategory(initialCategory);
  }, [initialCategory]);

  const handleChange = (e) => {
    setCategory(e.target.value);
    onCategoryChange(e.target.value);
  };

  return (
    <input
      ref={inputRef}
      type="text"
      value={category}
      onChange={handleChange}
      className={styles.categoryInput}
    />
  );
}

function EditModal({
  isOpen,
  onClose,
  onSave,
  diaryId = null,
  initialTitle = "",
  initialCode = "",
  initialDesc = "",
  initialCategory = "CATEGORY",
  initialHashtags = [],
}) {
  const [category, setCategory] = useState(initialCategory);
  const [title, setTitle] = useState(initialTitle);
  const [code, setCode] = useState(initialCode);
  const [description, setDescription] = useState(initialDesc);
  const [hashtags, setHashtags] = useState(initialHashtags.join(", "));
  const [dateStr, setDateStr] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";

      const now = new Date();
      const yy = now.getFullYear().toString().slice(-2);
      const mm = String(now.getMonth() + 1).padStart(2, "0");
      const dd = String(now.getDate()).padStart(2, "0");
      setDateStr(`${yy}.${mm}.${dd}`);

      setCategory(initialCategory);
      setTitle(initialTitle);
      setCode(initialCode);
      setDescription(initialDesc);
      setHashtags(initialHashtags.join(", "));
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSave = async () => {
    const accessToken = localStorage.getItem("token");

    const hashtagArray = hashtags
      .split(",")
      .map((tag) => tag.trim())
      .filter((tag) => tag.length > 0);

    const data = {
      diary_id: diaryId,
      memberId: 1,
      title,
      code,
      content: description,
      category,
      hashtags: hashtagArray,
    };

    try {
      setLoading(true);
      const response = await fetch("/diaries", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `${accessToken}`,
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error(`서버 오류: ${response.status}`);
      }

      const result = await response.json();
      console.log("저장 성공:", result);

      if (onSave) {
        onSave(result);
      }
      onClose();
    } catch (error) {
      console.error("저장 실패:", error);
      alert("글 저장에 실패했습니다. 다시 시도해주세요.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className={styles.modalOverlay} onClick={onClose} />
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <div className={styles.titleRow}>
          <InlineEditableCategory
            initialCategory={category}
            onCategoryChange={setCategory}
          />
          <span className={styles.dateText}>{dateStr}</span>
        </div>

        <label htmlFor="titleInput">제목</label>
        <input
          id="titleInput"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className={styles.titleInput}
          placeholder="제목을 입력하세요"
          disabled={loading}
        />

        <label htmlFor="codeInput">코드</label>
        <textarea
          id="codeInput"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder="코드를 작성하세요"
          className={styles.textareaCode}
          disabled={loading}
        />

        <label htmlFor="descInput">설명</label>
        <textarea
          id="descInput"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="설명을 작성하세요"
          className={styles.textareaDesc}
          disabled={loading}
        />

        <label htmlFor="hashtagInput">해시태그 (쉼표로 구분)</label>
        <textarea
          id="hashtagInput"
          value={hashtags}
          onChange={(e) => setHashtags(e.target.value)}
          placeholder="예: C언어, 백엔드"
          className={styles.textareaHashtag}
          disabled={loading}
        />

        <div className={styles.buttonRow}>
          <button onClick={onClose} disabled={loading}>
            취소
          </button>
          <button onClick={handleSave} disabled={loading}>
            {loading ? "저장 중..." : "저장"}
          </button>
        </div>
      </div>
    </>
  );
}

export default EditModal;
