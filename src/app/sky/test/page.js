"use client"; 

import { useState } from 'react';
// next/image의 Image 컴포넌트를 사용하면 이미지 최적화에 유리합니다.
import Image from 'next/image';
import styles from './quiz.module.css';
import { quizData } from './quizData.js';
import Profile from '@/app/components/Profile';

// --- 공지사항 컴포넌트 ---
function Notice() {
  return (
    <div className={styles.noticeBox}>
      <p>본 시험은 비행능력 테스트 필기 시험입니다.</p>
      <p><strong>80점 이상</strong>이어야 비행자격증을 취득할 수 있습니다.</p>
      <p>시간 제한은 없으며, 보기 중 옳은 것을 골라 체크해주세요.</p>
      <p>2025년 8월 10일 기준으로 출제되었습니다.</p>
      <p>본 시험은 공식이 아닌 개인 제작 시험지입니다. 재미로만 풀어주세요!</p>
      <p className={styles.noticeSign}>진사슴</p>
    </div>
  );
}

// --- 시험지 뷰 컴포넌트 ---
function QuizView({ profile, onProfileChange, answers, onAnswerChange, onSubmit }) {
  // ... 내용은 이전과 동일 ...
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
                      required
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

// --- 결과 뷰 컴포넌트 (수정) ---
function ResultView({ profile, score, onRetry }) {
  const isPass = score >= 80;
  
  return (
    <div className={styles.resultBox}>
      <img src={profile.image} alt="Profile" className={styles.resultProfileImage} />
      <h2 className={styles.resultName}>{profile.name} 님</h2>
      
      {isPass ? (
        <p className={`${styles.status} ${styles.pass}`}>
          비행자격시험에 통과했습니다!
        </p>
      ) : (
        <p className={`${styles.status} ${styles.fail}`}>
          불합했습니다!
        </p>
      )}
      
      <p className={styles.scoreText}>당신의 점수는 <span className={styles.score}>{score}</span>점 입니다.</p>
      <p className={styles.message}>
        {isPass
          ? "이제 스카이 왕국을 자유롭게 비행할 자격이 주어졌습니다. 축하합니다!"
          : "아쉽지만 다음 기회에 다시 도전해주세요. 응원하겠습니다!"}
      </p>

      {/* 2. 합격 시 자격증 표시 추가 */}
      {isPass && (
        <div className={styles.licenseBox}>
          <p>아래 자격증을 수령해가세요!</p>
          <img
            src="/sky/license.png"
            alt="자유비행 수행능력 1급 자격증"
            className={styles.licenseImage}
          />
        </div>
      )}

      <button onClick={onRetry} className={styles.retryButton}>다시 풀기</button>
    </div>
  );
}


// --- 메인 페이지 컴포넌트 (수정) ---
export default function SkyQuizPage() {
  // ... (useState, 핸들러 함수 등 모든 로직은 그대로) ...
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
    if (Object.keys(answers).length !== quizData.length) {
      alert('모든 문제에 답해주세요.');
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

  const handleRetry = () => {
    setAnswers({});
    setScore(0);
    setIsSubmitted(false);
  };


  return (
    // ▼▼▼▼▼ 바로 이 부분의 className을 수정합니다! ▼▼▼▼▼
    <div className={`${styles.container} ${isSubmitted ? styles.resultActive : ''}`}>
      <h1 className={styles.mainTitle}>자유비행 수행능력 1급 필기시험</h1>
      
      {!isSubmitted && <Notice />}

      {isSubmitted 
        ? <ResultView profile={profile} score={score} onRetry={handleRetry} /> 
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