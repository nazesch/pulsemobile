export default function Card({ children, className = '', gradient = false, onClick }) {
  // Check if className includes a background color (to avoid shadow on colored cards)
  const hasCustomBg = className.includes('bg-') && !className.includes('bg-white')
  const baseClasses = `rounded-2xl p-6 ${hasCustomBg ? '' : 'shadow-sm'}`
  const gradientClasses = gradient ? 'gradient-card' : (hasCustomBg ? '' : 'bg-white')
  const interactiveClasses = onClick ? 'cursor-pointer transition-transform hover:scale-[1.02] active:scale-[0.98]' : ''

  return (
    <div
      className={`${baseClasses} ${gradientClasses} ${interactiveClasses} ${className}`}
      onClick={onClick}
    >
      {children}
    </div>
  )
}

