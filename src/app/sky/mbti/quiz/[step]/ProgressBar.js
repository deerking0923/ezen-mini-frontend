'use client'
export default function ProgressBar({ current, total }) {
  const percent = Math.round((current / total) * 100)
  return (
    <div className="progress-container">
      <div 
        className="progress-fill" 
        style={{ width: `${percent}%` }}
      />
    </div>
  )
}
