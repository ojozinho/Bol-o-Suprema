import { useState, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { createPortal } from 'react-dom'

interface TooltipProps {
  content: React.ReactNode
  children: React.ReactElement
  side?: 'top' | 'bottom'
  maxWidth?: number
}

export function Tooltip({ content, children, side = 'top', maxWidth = 240 }: TooltipProps) {
  const [open, setOpen] = useState(false)
  const [coords, setCoords] = useState({ x: 0, y: 0, arrowX: 0, actualSide: side as 'top' | 'bottom' })
  const wrapperRef = useRef<HTMLSpanElement>(null)

  const handleEnter = useCallback(() => {
    if (!wrapperRef.current) return
    const r = wrapperRef.current.getBoundingClientRect()
    const triggerCenterX = r.left + r.width / 2
    const tooltipLeft = Math.max(8, Math.min(window.innerWidth - maxWidth - 8, triggerCenterX - maxWidth / 2))
    const arrowX = Math.min(maxWidth - 16, Math.max(10, triggerCenterX - tooltipLeft - 6))
    const actualSide: 'top' | 'bottom' =
      side === 'top' && r.top < 80 ? 'bottom' :
      side === 'bottom' && window.innerHeight - r.bottom < 80 ? 'top' :
      side

    setCoords({
      x: tooltipLeft,
      y: actualSide === 'top' ? r.top - 10 : r.bottom + 10,
      arrowX,
      actualSide,
    })
    setOpen(true)
  }, [side, maxWidth])

  const handleLeave = useCallback(() => setOpen(false), [])

  if (!content) return children

  const yOffset = coords.actualSide === 'top' ? 6 : -6

  return (
    <>
      <span ref={wrapperRef} onMouseEnter={handleEnter} onMouseLeave={handleLeave} className="inline-flex">
        {children}
      </span>
      {createPortal(
        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ opacity: 0, y: yOffset, scale: 0.93 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: yOffset / 2, scale: 0.96 }}
              transition={{ type: 'spring', damping: 22, stiffness: 500, mass: 0.5 }}
              style={{
                position: 'fixed',
                left: coords.x,
                top: coords.y,
                transform: coords.actualSide === 'top' ? 'translateY(-100%)' : 'translateY(0)',
                width: maxWidth,
                zIndex: 9999,
                pointerEvents: 'none',
              }}
            >
              {/* Body */}
              <div className="bg-ink text-paper px-3 py-2.5 border border-white/[0.08] shadow-2xl relative">
                {typeof content === 'string' ? (
                  <p className="font-mono text-[10px] leading-relaxed text-paper/90">{content}</p>
                ) : (
                  content
                )}

                {/* Arrow pointing down (tooltip is above) */}
                {coords.actualSide === 'top' && (
                  <div
                    style={{
                      position: 'absolute',
                      bottom: -6,
                      left: coords.arrowX,
                      width: 0,
                      height: 0,
                      borderLeft: '6px solid transparent',
                      borderRight: '6px solid transparent',
                      borderTop: '6px solid #0D0D0D',
                    }}
                  />
                )}

                {/* Arrow pointing up (tooltip is below) */}
                {coords.actualSide === 'bottom' && (
                  <div
                    style={{
                      position: 'absolute',
                      top: -6,
                      left: coords.arrowX,
                      width: 0,
                      height: 0,
                      borderLeft: '6px solid transparent',
                      borderRight: '6px solid transparent',
                      borderBottom: '6px solid #0D0D0D',
                    }}
                  />
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>,
        document.body,
      )}
    </>
  )
}
