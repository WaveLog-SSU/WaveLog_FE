import useCalendar from '../hooks/useCalendar';
import styles from './Calendar.module.css';
import { isToday, format } from 'date-fns';

const WEEKDAYS = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];

export default function Calendar({ onSelect, selectedDate, list = [] }) {
  const {
    currentDate,
    weeks,
    goToPrevMonth,
    goToNextMonth,
    prevCount,
    currCount,
    setCurrentDate
  } = useCalendar();

  const getDayType = (index) => {
    if (index < prevCount) return 'prev';
    if (index < prevCount + currCount) return 'current';
    return 'next';
  };

  // 날짜 문자열이 존재하는지 확인하는 Set
  const writtenDates = new Set(list.map(item => item.date));

  return (
    <div className={styles.wrapper}>
      <div className={styles.header}>
        <button className={styles.button} onClick={goToPrevMonth}>‹</button>
        <span className={styles.title}>
          {format(currentDate, 'yyyy MMM').toUpperCase()}.
        </span>
        <button className={styles.button} onClick={goToNextMonth}>›</button>
      </div>

      <div className={styles.weekdays}>
        {WEEKDAYS.map(day => (
          <div key={day} className={styles.weekday}>{day}</div>
        ))}
      </div>

      <div className={styles.grid}>
        {weeks.map((week, wIdx) => (
          <div key={wIdx} className={styles.weekRow}>
            {week.map((date, dIdx) => {
              const index = wIdx * 7 + dIdx;
              const type = getDayType(index);

              const fullDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), date);
              const formatted = format(fullDate, 'yyyy.MM.dd');

              const isTodayDate =
                type === 'current' && isToday(fullDate);

              const isSelectedDate =
                type === 'current' && selectedDate === formatted;

              const hasWriting = writtenDates.has(formatted);

              return (
                <div
                  key={dIdx}
                  className={`
                    ${styles.day}
                    ${type !== 'current' ? styles.otherMonth : styles.currentMonth}
                    ${isTodayDate ? styles.today : ''}
                    ${isSelectedDate ? styles.selected : ''}
                  `}
                  onClick={() => {
                    if (type === 'prev') {
                      const newDate = new Date(currentDate);
                      newDate.setMonth(newDate.getMonth() - 1);
                      newDate.setDate(date);
                      setCurrentDate(newDate);
                    } else if (type === 'next') {
                      const newDate = new Date(currentDate);
                      newDate.setMonth(newDate.getMonth() + 1);
                      newDate.setDate(date);
                      setCurrentDate(newDate);
                    } else {
                      onSelect?.(formatted);
                    }
                  }}
                >
                  <div>{date || ''}</div>
                  {hasWriting && <div className={styles.dot} />} {/* 여기 표시 */}
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}
