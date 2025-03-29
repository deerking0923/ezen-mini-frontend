'use client'
import Image from 'next/image'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import styles from './GalleryPage.module.css'

export default function GalleryPage() {
  const router = useRouter()
  // 1부터 8까지의 이미지 경로 생성
  const images = Array.from({ length: 8 }, (_, i) => `/sky/mbti/image/${i + 1}.png`)
  const [copySuccess, setCopySuccess] = useState('')

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText("https://korea-sky-planner.com/sky/mbti")
    } catch (err) {
      setCopySuccess("복사에 실패했습니다.")
      setTimeout(() => setCopySuccess(""), 2000)
    }
  }

  const handleGoHome = () => {
    router.push('/')
  }

  return (
    <main className={styles.container}>
      <div className={styles.gallery}>
        {images.map((src, index) => (
          <div key={index} className={styles.imageWrapper}>
            <Image 
              src={src} 
              alt={`유형 ${index + 1}`} 
              width={300} 
              height={300} 
              style={{ objectFit: 'contain', width: '100%', height: 'auto' }}
            />
          </div>
        ))}
      </div>
      <div className={styles.buttonRow}>
        <button className={styles.shareButton} onClick={handleShare}>
          공유하기
        </button>
        <button className={styles.homeButton} onClick={handleGoHome}>
          돌아가기
        </button>
      </div>
      {copySuccess && <span className={styles.copyMessage}>{copySuccess}</span>}
    </main>
  )
}
