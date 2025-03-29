'use client'
import { createContext, useState, useEffect } from 'react'

export const QuizContext = createContext()

export function QuizProvider({ children }) {
  // localStorage에 저장된 값을 초기 상태로 사용
  const [answers, setAnswers] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('quizAnswers')
      return saved ? JSON.parse(saved) : {}
    }
    return {}
  })

  // answers가 변경될 때마다 localStorage에 저장
  useEffect(() => {
    localStorage.setItem('quizAnswers', JSON.stringify(answers))
  }, [answers])

  return (
    <QuizContext.Provider value={{ answers, setAnswers }}>
      {children}
    </QuizContext.Provider>
  )
}
