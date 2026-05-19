export function EmptyChat() {
  return (
    <div className="flex flex-col items-center justify-center flex-1 gap-4 text-center py-16 px-6">
      <span className="font-display text-6xl text-ink-4">○</span>
      <div>
        <div className="font-display text-2xl text-ink leading-tight">NINGUÉM<br/>FALOU NADA.</div>
        <p className="font-mono text-[11px] text-ink-3 mt-2 max-w-[180px] mx-auto leading-relaxed">
          A resenha começa com você.
        </p>
      </div>
    </div>
  )
}

export function ChatSkeleton() {
  return (
    <div className="flex flex-col gap-4 py-4 px-4">
      {[68, 48, 82, 56, 40].map((w, i) => (
        <div key={i} className={`flex gap-2.5 items-end ${i % 2 === 0 ? '' : 'flex-row-reverse'}`}>
          {i % 2 === 0 && <div className="w-8 h-8 rounded-full bg-hairline flex-shrink-0 animate-pulse" />}
          <div
            className={`h-10 rounded-2xl bg-hairline animate-pulse ${i % 2 === 0 ? 'rounded-bl-sm' : 'rounded-br-sm'}`}
            style={{ width: `${w}%` }}
          />
        </div>
      ))}
    </div>
  )
}
