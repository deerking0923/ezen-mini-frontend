'use client'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useContext, use } from 'react'
import { QuizContext } from '../../../context/QuizContext'
import { questions } from '../../../utils/questions'
import styles from './QuestionPage.module.css'
import pbStyles from './ProgressBar.module.css'

export default function QuestionPage({ params }) {
  const { step } = use(params)
  const stepNum = Number(step)
  const { answers, setAnswers } = useContext(QuizContext)
  const question = questions[stepNum - 1]
  const router = useRouter()

  const handleSelect = choice => {
    setAnswers({ ...answers, [question.id]: choice })
    router.push(
      stepNum < questions.length
        ? `/sky/mbti/quiz/${stepNum + 1}`
        : '/sky/mbti/result'
    )
  }

  return (
    <div className={styles.card}>
      <div className={styles.questionImage}>
        <Image 
          src={`/sky/mbti/${question.id}.png`} 
          alt={question.text} 
          width={300} height={300} 
        />
      </div>

      <button 
        className={styles.optionButton} 
        onClick={() => handleSelect(question.options[0])}
      >
        {question.options[0]}
      </button>

      <button 
        className={styles.optionButton} 
        onClick={() => handleSelect(question.options[1])}
      >
        {question.options[1]}
      </button>

      <div className={pbStyles.container}>
        <div 
          className={pbStyles.fill} 
          style={{ width:`${(stepNum/questions.length)*100}%` }} 
        />
      </div>
      <div className={styles.progressText}>{stepNum} / {questions.length}</div>
    </div>
  )
}
