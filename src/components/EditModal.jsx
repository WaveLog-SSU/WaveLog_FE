import React, { useState, useEffect, useRef } from "react";
import styles from "./EditModal.module.css";
import api from "../api";
import Editor from "react-simple-code-editor";
import { highlight, languages } from "prismjs/components/prism-core";
import "prismjs/components/prism-clike";
import "prismjs/components/prism-javascript";

function InlineEditableCategory({ initialCategory, onCategoryChange }) {
  const [editing, setEditing] = useState(false);
  const [category, setCategory] = useState(initialCategory);
  const inputRef = useRef(null);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [editing]);

  const handleTextClick = () => {
    setCategory("");
    setEditing(true);
  };

  useEffect(() => {
    setCategory(initialCategory);
  }, [initialCategory]);

  const handleChange = (e) => {
    setCategory(e.target.value);
    onCategoryChange(e.target.value);
  };

  const handleBlur = () => {
    setEditing(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      setEditing(false);
    }
  };

  return editing ? (
    <input
      ref={inputRef}
      type="text"
      value={category}
      onChange={handleChange}
      onBlur={handleBlur}
      onKeyDown={handleKeyDown}
      className={styles.categoryInput}
    />
  ) : (
    <span
      onClick={handleTextClick}
      className={styles.categoryText}
    >
      <strong>{category || "CATEGORY"}</strong>
    </span>
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
    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("userId");

    if (!token || !userId) {
      alert("로그인 정보가 없습니다.");
      return;
    }

    const hashtagArray = hashtags
      .split(",")
      .map((tag) => tag.trim())
      .filter((tag) => tag.length > 0);

    const data = {
      memberId: Number(userId),
      title,
      code,
      content: description,
      category,
      hashtags: hashtagArray,
    };

    try {
      setLoading(true);
      const response = await api.post("/diaries", data, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const result = response.data;
      console.log("저장 성공:", result);
      alert("글이 성공적으로 저장되었습니다!"); // ✅ 저장 성공 팝업

      if (onSave) {
        onSave(result); // 부모에게 새 글 데이터 전달
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
        <Editor
          id="codeInput"
          value={code}
          onValueChange={setCode}
          highlight={(code) => highlight(code, languages.js)}
          padding={0}
          className={styles.textareaCode}
          placeholder="코드를 작성하세요"
          disabled={loading}
        />

        <label htmlFor="descInput">설명</label>
        <textarea
          id="descInput"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className={styles.textareaDesc}
          placeholder="설명을 작성하세요"
          disabled={loading}
        />

        <label htmlFor="hashtagsInput">해시태그 (쉼표로 구분)</label>
        <input
          id="hashtagsInput"
          value={hashtags}
          onChange={(e) => setHashtags(e.target.value)}
          className={styles.hashtagInput}
          placeholder="#예시, #테스트"
          disabled={loading}
        />

        <div className={styles.buttonGroup}>
          <button
            className={styles.myButton}
            onClick={onClose}
            disabled={loading}
          >
            취소
          </button>

          <button
            className={styles.myButton}
            onClick={handleSave}
            disabled={loading}
          >
            {loading ? "저장 중..." : "저장"}
          </button>
        </div>
      </div>
    </>
  );
}

export default EditModal;
