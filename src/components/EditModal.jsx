import React, { useState, useEffect, useRef } from "react";
import styles from "./EditModal.module.css";

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
  }, [
    isOpen,
    initialCategory,
    initialTitle,
    initialCode,
    initialDesc,
    initialHashtags,
  ]);

  if (!isOpen) return null;

  const handleSave = () => {
    const hashtagArray = hashtags
      .split(",")
      .map((tag) => tag.trim())
      .filter((tag) => tag.length > 0);

    const data = {
      memberId: 1,
      title,
      code,
      content: description,
      category,
      hashtags: hashtagArray,
    };

    onSave(data);
    onClose();
  };

  return (
    <>
      <div className={styles.modalOverlay} onClick={onClose} />
      <div
        className={styles.modalContent}
        onClick={(e) => e.stopPropagation()}
      >
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
        />

        <label htmlFor="codeInput">코드</label>
        <textarea
          id="codeInput"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder="코드를 작성하세요"
          className={styles.textareaCode}
        />

        <label htmlFor="descInput">설명</label>
        <textarea
          id="descInput"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="설명을 작성하세요"
          className={styles.textareaDesc}
        />

        <label htmlFor="hashtagInput">해시태그 (쉼표로 구분)</label>
        <textarea
          id="hashtagInput"
          value={hashtags}
          onChange={(e) => setHashtags(e.target.value)}
          placeholder="예: C언어, 백엔드"
          className={styles.textareaHashtag}
        />

        <div className={styles.buttonRow}>
          <button onClick={onClose}>취소</button>
          <button onClick={handleSave}>저장</button>
        </div>
      </div>
    </>
  );
}

export default EditModal;
