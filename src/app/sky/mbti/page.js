'use client'
export const dynamic = 'force-dynamic';
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import styles from './IntroPage.module.css'

export default function IntroPage() {
  const router = useRouter()

  const handleStart = () => {
    // 첫 번째 퀴즈 페이지로 이동
    router.push('/sky/mbti/quiz/1')
  }

  return (
    <div className={styles.card}>
      <h1 className={styles.title}>내 빛아의 성향은?</h1>
      
      <div className={styles.imageContainer}>
        <Image 
          src="/sky/mbti/shadow.png" 
          alt="Shadow 이미지" 
          width={400} 
          height={250}
          style={{ objectFit: 'contain', width: '100%', height: 'auto' }}
        />
      </div>

      <p className={styles.description}>
        내 빛아랑 가장 유사한 스카이 크리쳐는 무엇일까?
        <br />
        <br />
        8가지 분류로 보는 비공식 스카이 성향 테스트.
        <br />
        <br />        
        공신력은 제로에 가까우니 그저 재미로만 즐겨주세요!
      </p>
      <button className={styles.optionButton} onClick={handleStart}>
        테스트 하러 가기
      </button>
    </div>
  )
}
