import { cn } from '@/lib/utils'
import { getContentPreview } from '../utils/chatUi'

interface ReplyQuoteProps {
  r: { who: string; text: string; type: string }
  isMine: boolean
}

export function ReplyQuote({ r, isMine }: ReplyQuoteProps) {
  return (
    <div className={cn(
      'mb-1.5 px-2.5 py-1.5 border-l-2 rounded-sm text-[11px] max-w-full overflow-hidden',
      isMine ? 'bg-ink/10 border-ink/50' : 'bg-ink/6 border-ink/30',
    )}>
      <div className="font-mono text-[9px] font-bold text-ink-2 truncate">↩ {r.who}</div>
      <div className="font-sans text-[11px] text-ink-3 truncate">
        {getContentPreview({ type: r.type as 'text' | 'gif' | 'image' | 'audio', text: r.text })}
      </div>
    </div>
  )
}
