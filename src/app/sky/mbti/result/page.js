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

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText("https://korea-sky-planner.com/sky/mbti")
    } catch (err) {
      console.error("링크 복사 실패:", err)
    }
  }

  const handleViewOther = () => {
    router.push('/sky/mbti/gallery')
  }
//결과 이미지 수정.
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
          결과 다운로드
        </button>
      </div>
      <div className={`${styles.buttonRow} ${styles.secondaryRow}`}>
        <button className={styles.secondaryButton} onClick={handleShare}>
          공유하기
        </button>
        <button className={styles.secondaryButton} onClick={handleViewOther}>
          다른 유형 보러가기
        </button>
      </div>
    </main>
  )
}
