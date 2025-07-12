import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";           // src/api/index.js 에서 axios 인스턴스를 export
import styles from "./Quiz.module.css";

export default function Quiz() {
  const navigate = useNavigate();
  const [questions, setQuestions] = useState([]);
  const [current, setCurrent]   = useState(0);
  const [selected, setSelected] = useState(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState(null);

  // 1) 마운트 시 한 번만 API 콜
  useEffect(() => {
    api.get("quiz")
      .then(res => {
        setQuestions(res.data.questions);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setError("문제 불러오기 실패");
        setLoading(false);
      });
  }, []);

  const handleOptionClick = idx => {
    if (isAnswered) return;
    setSelected(idx);
    setIsAnswered(true);
  };

  const handleNext = () => {
    if (!isAnswered) return;
    const next = current + 1;
    if (next < questions.length) {
      setCurrent(next);
      setSelected(null);
      setIsAnswered(false);
    } else {
      // 마지막 문제 후 결과 페이지로 이동 예시
      navigate("/quiz/result", { state: { questions, selected } });
    }
  };

  const handleBack = () => {
    if (current > 0) {
      setCurrent(current - 1);
      setSelected(null);
      setIsAnswered(false);
    } else {
      navigate(-1);
    }
  };

  if (loading) return <div className={styles.loading}>로딩 중…</div>;
  if (error)   return <div className={styles.error}>{error}</div>;
  if (questions.length === 0) return <div className={styles.error}>등록된 문제가 없습니다.</div>;

  const { prompt, options, answerIndex } = questions[current];

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <button className={styles.backBtn} onClick={handleBack}>←</button>
        <h1 className={styles.title}>QUIZ</h1>
      </header>

      <div className={styles.quizBox}>
        <div className={styles.questionNumber}>Q.{current + 1}</div>
        <div className={styles.questionText}>{prompt}</div>

        <ul className={styles.optionsList}>
          {options.map((opt, idx) => {
            let btnClass = styles.optionButton;
            if (isAnswered) {
              if (idx === answerIndex)      btnClass += ` ${styles.correct}`;
              else if (idx === selected)    btnClass += ` ${styles.wrong}`;
            } else if (idx === selected) {
              btnClass += ` ${styles.selected}`;
            }

            return (
              <li
                key={idx}
                className={btnClass}
                onClick={() => handleOptionClick(idx)}
              >
                {opt}
              </li>
            );
          })}
        </ul>

        {isAnswered && (
          <div
            className={
              selected === answerIndex
                ? styles.feedbackCorrect
                : styles.feedbackWrong
            }
          >
            {selected === answerIndex ? "O" : "X"}
          </div>
        )}
      </div>

      <footer className={styles.footer}>
        <button
          className={`${styles.nextBtn} ${!isAnswered ? styles.disabled : ""}`}
          onClick={handleNext}
          disabled={!isAnswered}
        >
          {current < questions.length - 1 ? "다음" : "완료"}
        </button>
      </footer>
    </div>
  );
}
