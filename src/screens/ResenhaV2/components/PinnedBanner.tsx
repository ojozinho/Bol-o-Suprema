import { motion } from 'framer-motion'
import type { ChatMessage } from '@/types'
import { getContentPreview } from '../utils/chatUi'

interface PinnedBannerProps {
  msg: ChatMessage
  isAdmin: boolean
  onUnpin: () => void
}

export function PinnedBanner({ msg, isAdmin, onUnpin }: PinnedBannerProps) {
  return (
    <motion.div
      initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }}
      transition={{ duration: 0.18 }}
      className="overflow-hidden flex-shrink-0"
    >
      <div className="border-b border-yellow/40 bg-yellow/8 px-4 py-2 flex items-center gap-2">
        <span className="text-[10px] flex-shrink-0">📌</span>
        <p className="flex-1 font-sans text-[12px] text-ink-2 truncate min-w-0">
          <span className="font-bold text-ink">{msg.who}: </span>
          {getContentPreview(msg)}
        </p>
        {isAdmin && (
          <button onClick={onUnpin} className="font-mono text-[9px] text-ink-4 hover:text-ink flex-shrink-0 ml-2 transition-colors">
            DESAFIXAR
          </button>
        )}
      </div>
    </motion.div>
  )
}
