"use client";

import { useState, useRef } from 'react';
import Image from 'next/image';
import styles from './quiz.module.css';
import { quizData } from './quizData.js';
import Profile from '@/app/components/Profile';
import html2canvas from 'html2canvas';

// --- 공지사항 컴포넌트 ---
function Notice() {
  return (
    <div className={styles.noticeBox}>
      <p>본 시험은 Sky:Children Of Light의 팬 제작 모의고사입니다.</p>
      <p>시간 제한은 없으며, 아는만큼 편하게 풀어주세요.</p>
      <p>25년 8월 22일 기준으로 출제되었습니다.</p>
      <p>80점 이상 - 고인물 / 60점 이상 - 중비 / 60점 미만 - 참새</p>
      <p className={styles.noticeSign}>출제자 진사슴</p>
    </div>
  );
}

// --- 시험지 뷰 컴포넌트 ---
function QuizView({ profile, onProfileChange, answers, onAnswerChange, onSubmit }) {
  return (
    <>
      <Profile initialProfile={profile} onProfileChange={onProfileChange} />
      <form onSubmit={onSubmit}>
        <div className={styles.quizContainer}>
          {quizData.map((quiz, index) => (
            <div key={index} className={styles.questionContainer}>
              <p className={styles.questionText}>{quiz.question}</p>
              <div className={styles.optionsForm}>
                {quiz.options.map((option, i) => (
                  <div key={i} className={styles.option}>
                    <input
                      type="radio"
                      id={`q${index}_option${i}`}
                      name={`question_${index}`}
                      value={option}
                      checked={answers[index] === option}
                      onChange={() => onAnswerChange(index, option)}
                    />
                    <label htmlFor={`q${index}_option${i}`}>{` (${i + 1}) ${option}`}</label>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
        <button type="submit" className={styles.submitButton}>제출하기</button>
      </form>
    </>
  );
}

// --- 정답지 토글 컴포넌트 ---
function AnswerSheet({ userAnswers }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className={styles.answerSheetContainer}>
      <button onClick={() => setIsOpen(!isOpen)} className={styles.toggleButton}>
        정답지 보기 {isOpen ? '▲' : '▼'}
      </button>
      {isOpen && (
        <div className={styles.answerSheetContent}>
          {quizData.map((quiz, index) => {
            const userAnswer = userAnswers[index] || "미제출";
            const isCorrect = quiz.answer === userAnswer;
            return (
              <div key={index} className={styles.answerItem}>
                <p className={styles.answerQuestion}>{quiz.question}</p>
                <p><strong>정답:</strong> {quiz.answer}</p>
                <p><strong>내 답변: </strong>
                  <span className={isCorrect ? styles.correctAnswer : styles.incorrectAnswer}>
                    {userAnswer} {isCorrect ? '✔' : '❌'}
                  </span>
                </p>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// --- 결과 뷰 컴포넌트 (수정됨) ---
function ResultView({ profile, score, answers, onRetry }) {
  const certificateRef = useRef(null); // 캡쳐할 영역을 참조

  const getGrade = (score) => {
    if (score >= 80) {
      return { grade: '고인물', message: '스카이 왕국의 모든 것을 꿰뚫고 있군요! 존경합니다!' };
    } else if (score >= 60) {
      return { grade: '중비', message: '훌륭해요! 당신은 어느정도 숙련된 빛의 아이입니다.' };
    } else {
      return { grade: '참새', message: '괜찮아요! 이제 막 알아가는 단계인걸요. 함께 날아봐요!' };
    }
  };

  const { grade, message } = getGrade(score);

  const handleShare = async () => {
    // (이전과 동일)
    if (navigator.share) {
      try {
        await navigator.share({
          title: '스카이 모의고사 결과!',
          text: `${profile.name}님의 25년 8월 스카이 모의고사 점수는 ${score}점, 등급은 '${grade}'입니다!`,
          url: 'https://korea-sky-planner.com/sky/test',
        });
      } catch (error) { console.error('공유에 실패했습니다.', error); }
    } else {
      try {
        await navigator.clipboard.writeText('https://korea-sky-planner.com/sky/test');
        alert('링크가 클립보드에 복사되었습니다!');
      } catch (error) { alert('공유하기가 지원되지 않는 브라우저입니다.'); }
    }
  };

  // 자격증 다운로드 기능 (캡쳐 영역 및 배경색 수정)
  const handleDownload = () => {
    if (certificateRef.current) {
      html2canvas(certificateRef.current, {
        backgroundColor: '#ffffff', // 캡쳐 시 배경을 흰색으로 지정
        useCORS: true, // 다른 도메인의 이미지를 사용할 경우 필요
      }).then(canvas => {
        const image = canvas.toDataURL('image/png');
        const link = document.createElement('a');
        link.href = image;
        link.download = '25년_8월_스카이_모의고사_결과.png';
        link.click();
      });
    }
  };

  return (
    // 결과 화면 전체를 감싸는 새로운 컨테이너
    <div className={styles.resultContainer}>
      
      {/* ▼▼▼ 여기부터 캡쳐될 영역입니다 ▼▼▼ */}
      <div className={styles.certificateBox} ref={certificateRef}>
        <div className={styles.titleContainer}>
          <h1 className={styles.mainTitle}>이달의 모의고사</h1>
          <span className={styles.subTitle}>25년 8월</span>
        </div>
        <img src={profile.image} alt="Profile" className={styles.resultProfileImage} />
        <h2 className={styles.resultName}>{profile.name} 님</h2>
        <p className={`${styles.status} ${styles.pass}`}>
          당신은 <span className={styles.grade}>{grade}</span>입니다!
        </p>
        <p className={styles.scoreText}>당신의 점수는 <span className={styles.score}>{score}</span>점 입니다.</p>
        <p className={styles.message}>{message}</p>
      </div>
      {/* ▲▲▲ 여기까지 캡쳐될 영역입니다 ▲▲▲ */}

      {/* 아래는 캡쳐되지 않는 부분 */}
      <AnswerSheet userAnswers={answers} />

      <div className={styles.buttonContainer}>
        <button onClick={onRetry} className={styles.retryButton}>다시 풀기</button>
        <button onClick={handleShare} className={styles.shareButton}>공유하기</button>
        <button onClick={handleDownload} className={styles.downloadButton}>자격증 다운로드</button>
      </div>
    </div>
  );
}

// --- 메인 페이지 컴포넌트 (수정됨) ---
export default function SkyQuizPage() {
  const [profile, setProfile] = useState({ name: '', image: 'https://placehold.co/100x100/EFEFEF/AAAAAA&text=Profile' });
  const [answers, setAnswers] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  const handleProfileChange = (field, value) => {
    setProfile(prev => ({ ...prev, [field]: value }));
  };

  const handleAnswerChange = (questionIndex, answer) => {
    setAnswers(prev => ({ ...prev, [questionIndex]: answer }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!profile.name) {
      alert('이름을 입력해주세요.');
      return;
    }
    let finalScore = 0;
    quizData.forEach((quiz, index) => {
      if (quiz.answer === answers[index]) {
        finalScore += 10;
      }
    });
    setScore(finalScore);
    setIsSubmitted(true);
  };

  // '다시 풀기' 기능 수정
  const handleRetry = () => {
    // setAnswers({}); // 이 줄을 주석 처리하거나 삭제하여 답안을 유지합니다.
    setScore(0);
    setIsSubmitted(false);
  };

  return (
    <div className={`${styles.container} ${isSubmitted ? styles.resultActive : ''}`}>
      {/* 시험 제출 전(isSubmitted가 false일 때)에만 제목을 보여줍니다. */}
      {!isSubmitted && (
        <div className={styles.titleContainer}>
          <h1 className={styles.mainTitle}>이달의 모의고사</h1>
          <span className={styles.subTitle}>25년 8월</span>
        </div>
      )}

      {!isSubmitted && <Notice />}

      {isSubmitted
        ? <ResultView
          profile={profile}
          score={score}
          answers={answers}
          onRetry={handleRetry}
        />
        : <QuizView
          profile={profile}
          onProfileChange={handleProfileChange}
          answers={answers}
          onAnswerChange={handleAnswerChange}
          onSubmit={handleSubmit}
        />
      }
    </div>
  );
}