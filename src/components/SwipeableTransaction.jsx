import { useState, useRef, useEffect } from 'react'

/**
 * SwipeableTransaction - A component that allows swiping to reveal delete action
 * 
 * @param {Object} props
 * @param {React.ReactNode} props.children - The transaction content to display
 * @param {Function} props.onDelete - Callback when delete is triggered
 * @param {string} props.className - Additional CSS classes
 */
export default function SwipeableTransaction({ children, onDelete, className = '' }) {
  const [swipeOffset, setSwipeOffset] = useState(0)
  const [isDeleting, setIsDeleting] = useState(false)
  const containerRef = useRef(null)
  const startXRef = useRef(null)
  const currentXRef = useRef(null)
  const isDraggingRef = useRef(false)

  const DELETE_THRESHOLD = 80 // Pixels to swipe before delete is triggered
  const DELETE_WIDTH = 80 // Width of delete button area

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const handleTouchStart = (e) => {
      const touch = e.touches[0]
      startXRef.current = touch.clientX
      currentXRef.current = touch.clientX
      isDraggingRef.current = true
    }

    const handleTouchMove = (e) => {
      if (!isDraggingRef.current) return
      
      const touch = e.touches[0]
      currentXRef.current = touch.clientX
      const deltaX = currentXRef.current - startXRef.current
      
      // Only allow swiping left (negative delta)
      if (deltaX < 0) {
        setSwipeOffset(Math.max(deltaX, -DELETE_WIDTH))
      } else {
        // Allow swiping back to reset
        setSwipeOffset(Math.min(deltaX, 0))
      }
    }

    const handleTouchEnd = () => {
      if (!isDraggingRef.current) return
      isDraggingRef.current = false

      const deltaX = currentXRef.current - startXRef.current
      
      if (deltaX < -DELETE_THRESHOLD) {
        // Trigger delete
        setIsDeleting(true)
        setTimeout(() => {
          onDelete?.()
          setIsDeleting(false)
          setSwipeOffset(0)
        }, 200)
      } else {
        // Snap back
        setSwipeOffset(0)
      }
      
      startXRef.current = null
      currentXRef.current = null
    }

    container.addEventListener('touchstart', handleTouchStart, { passive: true })
    container.addEventListener('touchmove', handleTouchMove, { passive: true })
    container.addEventListener('touchend', handleTouchEnd, { passive: true })

    return () => {
      container.removeEventListener('touchstart', handleTouchStart)
      container.removeEventListener('touchmove', handleTouchMove)
      container.removeEventListener('touchend', handleTouchEnd)
    }
  }, [onDelete])

  return (
    <div className="relative" style={{ touchAction: 'pan-y', overflow: 'hidden' }}>
      <div
        ref={containerRef}
        className={`transition-transform duration-200 ${className} ${isDeleting ? 'opacity-0 scale-95' : ''}`}
        style={{
          transform: `translateX(${swipeOffset}px)`,
          willChange: isDraggingRef.current ? 'transform' : 'auto',
        }}
      >
        {children}
      </div>
      
      {/* Delete button background */}
      <div
        className="absolute right-0 top-0 bottom-0 flex items-center justify-end pr-4 bg-red-500"
        style={{
          width: `${DELETE_WIDTH}px`,
          transform: `translateX(${swipeOffset < -DELETE_THRESHOLD ? 0 : DELETE_WIDTH + swipeOffset}px)`,
          transition: swipeOffset === 0 ? 'transform 0.2s ease-out' : 'none',
          opacity: Math.abs(swipeOffset) > 20 ? 1 : Math.abs(swipeOffset) / 20,
        }}
      >
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="white"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polyline points="3 6 5 6 21 6" />
          <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
        </svg>
      </div>
    </div>
  )
}

