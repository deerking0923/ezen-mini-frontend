import SheetMusicEditor from "@/app/components/SheetMusicEditor";
import styles from "./page.module.css";

export default function SkyMusicEditorPage() {
  return (
    <main className={styles.main}>
      <header className={styles.header}>
        <h1>🎵 Sky Harmony Studio</h1>
        <p>클릭하여 자신만의 악보를 만들어 보세요.</p>
      </header>

      <div className={styles.infoForm}>
        <div className={styles.inputGroup}>
          <label htmlFor="title">악보 제목</label>
          <input type="text" id="title" placeholder="작은별" />
        </div>
        <div className={styles.inputGroup}>
          <label htmlFor="composer">원작자</label>
          <input type="text" id="composer" placeholder="모차르트" />
        </div>
        <div className={styles.inputGroup}>
          <label htmlFor="arranger">악보 제작자</label>
          <input type="text" id="arranger" placeholder="홍길동" />
        </div>
      </div>

      <SheetMusicEditor />
    </main>
  );
}