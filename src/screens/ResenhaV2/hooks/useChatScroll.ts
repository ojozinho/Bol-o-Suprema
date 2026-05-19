import { useRef, useState, useCallback, useEffect } from 'react'
import type { ChatMessage } from '@/types'

export function useChatScroll(messages: ChatMessage[], isLoaded: boolean) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const bottomRef = useRef<HTMLDivElement>(null)
  const [atBottom, setAtBottom] = useState(true)

  const scrollToBottom = useCallback(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [])

  const handleScroll = useCallback(() => {
    const el = scrollRef.current
    if (!el) return
    const threshold = 80
    setAtBottom(el.scrollHeight - el.scrollTop - el.clientHeight < threshold)
  }, [])

  useEffect(() => {
    if (isLoaded) {
      const el = scrollRef.current
      if (el) el.scrollTop = el.scrollHeight
    }
  }, [isLoaded])

  useEffect(() => {
    if (atBottom) bottomRef.current?.scrollIntoView({ behavior: 'instant' as ScrollBehavior })
  }, [messages.length, atBottom])

  return { scrollRef, bottomRef, atBottom, handleScroll, scrollToBottom }
}
