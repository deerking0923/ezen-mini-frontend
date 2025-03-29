'use client'
import { useContext, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { QuizContext } from '../../context/QuizContext'
import { calcResult } from '../../utils/calculateResult'
import styles from './ResultPage.module.css'

export default function ResultPage() {
  const { answers } = useContext(QuizContext)
  const code = calcResult(answers)
  const fullImageSrc = `/sky/mbti/result/${code.toLowerCase()}.jpg`
  const headImageSrc = `/sky/mbti/result/${code.toLowerCase()}_head.jpg`
  const router = useRouter()

  // 클라이언트에서 마운트된 이후에만 렌더링
  const [mounted, setMounted] = useState(false)
  useEffect(() => {
    setMounted(true)
  }, [])
  if (!mounted) return null

  const handleDownloadFull = () => {
    const link = document.createElement('a')
    link.href = fullImageSrc
    link.download = `${code}.jpg`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const handleDownloadHead = () => {
    const link = document.createElement('a')
    link.href = headImageSrc
    link.download = `${code}_head.jpg`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const handleRetake = () => {
    router.push('/sky/mbti')
  }

  const handleViewOther = () => {
    router.push('/sky/mbti/gallery')
  }

  return (
    <main className={styles.container}>
      <div className={styles.imageWrapper}>
        <Image 
          src={fullImageSrc} 
          alt={`${code} 결과 이미지`} 
          width={500}
          height={800}
          style={{ objectFit: 'contain', width: '100%', height: 'auto' }}
          priority
        />
      </div>
      <div className={styles.buttonRow}>
        <button className={`${styles.button} ${styles.downloadLink}`} onClick={handleDownloadHead}>
          대표 이미지 다운로드
        </button>
        <button className={`${styles.button} ${styles.downloadLink}`} onClick={handleDownloadFull}>
          결과 다운로드
        </button>
      </div>
      <div className={`${styles.buttonRow} ${styles.secondaryRow}`}>
        <button className={styles.secondaryButton} onClick={handleRetake}>
          다시 검사하기
        </button>
        <button className={styles.secondaryButton} onClick={handleViewOther}>
          다른 유형 보러가기
        </button>
      </div>
    </main>
  )
}
