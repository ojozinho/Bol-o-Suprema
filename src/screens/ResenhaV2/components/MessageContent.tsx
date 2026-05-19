import { useState } from 'react'
import { AnimatePresence } from 'framer-motion'
import { isSafeHttpUrl } from '@/lib/security'
import type { ChatMessage } from '@/types'
import { ReplyQuote } from './ReplyQuote'
import { AudioBubble } from './AudioBubble'
import { ImageViewer } from './ImageViewer'
import { PollCard } from './PollCard'

interface ContentProps {
  message: ChatMessage
  isMine: boolean
  userId?: string
  onVote: (optId: string) => void
}

export function MessageContent({ message: m, isMine, userId, onVote }: ContentProps) {
  const [lightbox, setLightbox] = useState(false)

  return (
    <>
      {m.replyTo && <ReplyQuote r={m.replyTo} isMine={isMine} />}

      {m.type === 'poll' && m.poll ? (
        <PollCard poll={m.poll} userId={userId} onVote={onVote} />
      ) : m.type === 'gif' && isSafeHttpUrl(m.gifUrl) ? (
        <img
          src={m.gifUrl}
          alt="GIF"
          className="w-full max-h-52 object-contain block rounded"
          loading="lazy"
        />
      ) : m.type === 'image' && isSafeHttpUrl(m.imageUrl) ? (
        <>
          <button onClick={() => setLightbox(true)} className="block w-full hover:opacity-90 transition-opacity">
            <img
              src={m.imageUrl}
              alt="Foto"
              className="w-full max-h-64 object-cover block rounded"
              loading="lazy"
            />
          </button>
          <AnimatePresence>
            {lightbox && <ImageViewer url={m.imageUrl!} onClose={() => setLightbox(false)} />}
          </AnimatePresence>
        </>
      ) : m.type === 'audio' && m.audioUrl ? (
        <AudioBubble src={m.audioUrl} initialDuration={m.audioDuration} isMine={isMine} />
      ) : (
        <p className="whitespace-pre-wrap break-words pr-7 font-sans text-[14px] leading-relaxed">
          {m.text}
        </p>
      )}
    </>
  )
}
