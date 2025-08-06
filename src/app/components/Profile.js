"use client";

// useState를 제거하고 부모로부터 상태를 직접 받습니다.
import styles from './Profile.module.css';

export default function Profile({ initialProfile, onProfileChange }) {

  const handleNameChange = (e) => {
    onProfileChange('name', e.target.value);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onProfileChange('image', reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className={styles.profileBox}>
      <h2 className={styles.subTitle}>응시자 정보</h2>
      <div className={styles.profileContent}>
        <div className={styles.imageContainer}>
          {/* 부모에게서 받은 profile.image를 직접 사용합니다. */}
          <img src={initialProfile.image} alt="Profile Preview" className={styles.profileImage} />
          <input 
            type="file" 
            id="profileImage" 
            accept="image/*" 
            onChange={handleImageChange} 
            className={styles.imageInput} 
          />
          <label htmlFor="profileImage" className={styles.imageUploadButton}>캐릭터 사진 선택</label>
        </div>
        <div className={styles.nameContainer}>
          <label htmlFor="name">이름</label>
          <input
            type="text"
            id="name"
            // 부모에게서 받은 profile.name을 직접 사용합니다.
            value={initialProfile.name}
            onChange={handleNameChange}
            placeholder="이름을 입력하세요"
            className={styles.nameInput}
          />
        </div>
      </div>
    </div>
  );
}