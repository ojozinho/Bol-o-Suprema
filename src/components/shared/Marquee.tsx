interface MarqueeProps {
  items: string[]
  speed?: number
  color?: string
  bg?: string
  separator?: string
}

export function Marquee({ items, speed = 40, color = '#0D0D0D', bg = 'transparent', separator = '·' }: MarqueeProps) {
  const content = items.join(` ${separator} `)
  const spanClass = 'font-mono text-[11px] font-semibold tracking-eyebrow uppercase whitespace-nowrap pr-8'

  return (
    <div className="overflow-hidden" style={{ background: bg }}>
      <div
        className="inline-flex animate-marquee py-2.5"
        style={{ color, animationDuration: `${speed}s` }}
      >
        <span className={spanClass}>{content}</span>
        <span className={spanClass} aria-hidden="true">{content}</span>
      </div>
    </div>
  )
}
