import { cn } from '@/lib/utils'
import type { ChatPoll } from '@/types'

interface PollCardProps {
  poll: ChatPoll
  userId?: string
  onVote: (optId: string) => void
}

export function PollCard({ poll, userId, onVote }: PollCardProps) {
  const myVote   = userId ? poll.votes[userId] : null
  const hasVoted = !!myVote
  const total    = Object.keys(poll.votes).length

  return (
    <div className="border-2 border-ink bg-paper p-4 min-w-[220px]">
      <p className="font-display text-[14px] leading-tight mb-4">{poll.question}</p>
      <div className="space-y-2">
        {poll.options.map(opt => {
          const count    = Object.values(poll.votes).filter(v => v === opt.id).length
          const pct      = total > 0 ? Math.round((count / total) * 100) : 0
          const isMyPick = myVote === opt.id
          return (
            <button
              key={opt.id}
              onClick={() => !hasVoted && onVote(opt.id)}
              disabled={hasVoted && !isMyPick}
              className={cn(
                'w-full text-left relative overflow-hidden border transition-colors',
                isMyPick ? 'border-ink' : 'border-hairline',
                !hasVoted && 'hover:border-line cursor-pointer',
              )}
            >
              <div
                className={cn('absolute inset-0 transition-all duration-700', isMyPick ? 'bg-yellow/50' : 'bg-paper-deep/70')}
                style={{ width: hasVoted ? `${pct}%` : '0%' }}
              />
              <div className="relative flex items-center justify-between px-3 py-2.5">
                <span className={cn('font-sans text-[12px]', isMyPick ? 'font-bold' : 'text-ink-2')}>
                  {isMyPick && '✓ '}{opt.text}
                </span>
                {hasVoted && (
                  <span className="font-mono text-[10px] text-ink-3 ml-2 flex-shrink-0">{pct}%</span>
                )}
              </div>
            </button>
          )
        })}
      </div>
      <p className="font-mono text-[10px] text-ink-4 mt-3">
        {total} {total === 1 ? 'voto' : 'votos'}
        {!hasVoted && ' · toque para votar'}
      </p>
    </div>
  )
}
