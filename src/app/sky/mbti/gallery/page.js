// src/app/sky/mbti/gallery/page.js
'use client'
import Image from 'next/image'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import styles from './GalleryPage.module.css'

export default function GalleryPage() {
  const router = useRouter()
  const thumbnails = Array.from({ length: 8 }, (_, i) => `/sky/mbti/image/${i + 1}.png`)
  const results = [
    'etj.jpg',
    'etp.jpg',
    'efj.jpg',
    'efp.jpg',
    'itj.jpg',
    'itp.jpg',
    'ifj.jpg',
    'ifp.jpg'
  ]

  const [selectedIndex, setSelectedIndex] = useState(null)
  const [copySuccess, setCopySuccess] = useState('')

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText("https://korea-sky-planner.com/sky/mbti")
      setCopySuccess('링크가 복사되었습니다.')
    } catch (err) {
      setCopySuccess('복사에 실패했습니다.')
    }
    setTimeout(() => setCopySuccess(''), 2000)
  }

  const handleGoHome = () => router.push('/')
  const openModal = index => setSelectedIndex(index)
  const closeModal = () => setSelectedIndex(null)

  return (
    <main className={styles.container}>
      <div className={styles.gallery}>
        {thumbnails.map((src, index) => (
          <div key={index} className={styles.imageWrapper} onClick={() => openModal(index)}>
            <Image
              src={src}
              alt={`유형 ${index + 1}`}
              width={300}
              height={300}
              style={{ objectFit: 'contain', width: '100%', height: 'auto', cursor: 'pointer' }}
            />
          </div>
        ))}
      </div>

      {selectedIndex !== null && (
        <div className={styles['modal-overlay']} onClick={closeModal}>
          <div className={styles['modal-content']} onClick={e => e.stopPropagation()}>
            <button className={styles['modal-close']} onClick={closeModal}>✕</button>
            <h2 className={styles['modal-title']}>결과 보기</h2>
            <Image
              src={`/sky/mbti/result3/${results[selectedIndex]}`}
              alt={`결과 ${results[selectedIndex]}`}
              width={500}
              height={500}
              style={{ objectFit: 'contain', width: '100%', height: 'auto' }}
            />
            <button className={styles['modal-close-bottom']} onClick={closeModal}>닫기</button>
          </div>
        </div>
      )}

      <div className={styles.buttonRow}>
        <button className={styles.shareButton} onClick={handleShare}>공유하기</button>
        <button className={styles.homeButton} onClick={handleGoHome}>홈으로</button>
      </div>
      {copySuccess && <span className={styles.copyMessage}>{copySuccess}</span>}
    </main>
  )
}