import { useNavigate } from 'react-router-dom'
import { Flag } from '@/components/shared/Flag'
import { Marquee } from '@/components/shared/Marquee'
import { useIsDesktop } from '@/hooks/useBreakpoint'
import { MOCK_UPCOMING } from '@/data/mock'
import { asset, cn } from '@/lib/utils'

const TOURNAMENT_START = new Date('2026-06-11T15:00:00')

const MARQUEE_ITEMS = [
  'COPA DO MUNDO 2026',
  'USA · CAN · MEX',
  '48 SELEÇÕES · 104 PARTIDAS',
  'FASE DE GRUPOS · 11 JUN',
  'OITAVAS · 27 JUN',
  'QUARTAS · 4 JUL',
  'SEMIFINAIS · 14 JUL',
  'FINAL · 19 JUL',
  'FAÇA JÁ SEU PALPITE →',
]

function daysUntil(target: Date): number {
  const now = new Date()
  return Math.max(0, Math.ceil((target.getTime() - now.getTime()) / 86_400_000))
}

export function HomeScreen() {
  const isDesktop = useIsDesktop()
  return isDesktop ? <HomeDesktop /> : <HomeMobile />
}

// ─── Mobile ───────────────────────────────────────────────────────────────────

function HomeMobile() {
  const navigate = useNavigate()
  const upcoming = MOCK_UPCOMING
  const days = daysUntil(TOURNAMENT_START)

  return (
    <div className="min-h-dvh bg-paper pb-24">

      {/* ── Hero — countdown ── */}
      <section className="relative overflow-hidden" style={{ height: 300 }}>
        <img
          src={asset('assets/hero-jogadores.webp')}
          alt=""
          className="absolute inset-0 w-full h-full object-cover object-top"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-ink/40 via-ink/10 to-ink/90" />
        <div className="absolute inset-0 flex flex-col items-center justify-end pb-6 px-4 text-center">
          <div className="font-mono text-[10px] tracking-eyebrow text-paper/60 mb-1">
            COPA DO MUNDO 2026 · FASE DE GRUPOS
          </div>
          <div className="font-display text-[80px] leading-none text-paper">{days}</div>
          <div className="font-display text-2xl text-paper/70 -mt-1">DIAS</div>
          <div className="font-serif-it text-sm text-yellow mt-1">para a bola rolar · 11 Jun · 15:00</div>
        </div>
      </section>

      <div className="px-4 space-y-3 pt-4">

        {/* ── CTA palpite ── */}
        <div className="bg-yellow border-2 border-ink p-4 flex items-start justify-between gap-3">
          <div>
            <div className="font-mono text-[10px] tracking-eyebrow text-ink-3 mb-1">APOSTAS ABERTAS</div>
            <div className="leading-none">
              <span className="font-display text-4xl text-ink">{upcoming.length} JOGOS</span>
              <br />
              <span className="font-serif-it text-xl text-green-deep">esperando você</span>
            </div>
          </div>
          <button onClick={() => navigate('/prediction')} className="btn-ink text-[11px] px-4 py-2.5 flex-shrink-0 mt-1">
            PALPITAR →
          </button>
        </div>

        {/* ── Upcoming matches ── */}
        <div>
          <div className="flex items-baseline gap-2 mb-2">
            <span className="font-display text-lg text-ink">PRÓXIMOS</span>
            <span className="font-serif-it text-sm text-ink-3">jogos</span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {upcoming.slice(0, 4).map(match => (
              <button
                key={match.id}
                onClick={() => navigate('/prediction')}
                className="border-2 border-ink p-3 flex items-center gap-2 hover:-translate-y-px transition-transform text-left"
              >
                <Flag team={match.home} size={22} />
                <span className="font-mono text-[10px] font-bold">{match.home.code}</span>
                <span className="font-mono text-[9px] text-ink-4 mx-0.5">×</span>
                <span className="font-mono text-[10px] font-bold">{match.away.code}</span>
                <Flag team={match.away} size={22} />
              </button>
            ))}
          </div>
          {upcoming.length > 4 && (
            <button onClick={() => navigate('/prediction')} className="mt-2 font-mono text-[10px] text-ink-3 hover:text-ink tracking-eyebrow">
              + {upcoming.length - 4} JOGOS RESTANTES →
            </button>
          )}
        </div>

        {/* ── Ranking — empty state ── */}
        <div className="border-2 border-ink p-4">
          <div className="flex items-baseline justify-between mb-1">
            <div className="flex items-baseline gap-2">
              <span className="font-display text-lg">RANKING</span>
              <span className="font-serif-it text-sm text-ink-3">em breve</span>
            </div>
            <button onClick={() => navigate('/ranking')} className="font-mono text-[10px] text-ink-4 hover:text-ink tracking-eyebrow">
              VER →
            </button>
          </div>
          <p className="font-mono text-[11px] text-ink-3 py-4 text-center leading-relaxed">
            Os pontos aparecem aqui quando os jogos começarem.
          </p>
        </div>

        {/* ── Bracket CTA ── */}
        <div className="border-2 border-ink p-4 flex items-center justify-between gap-3">
          <div>
            <div className="font-mono text-[10px] tracking-eyebrow text-ink-3 mb-0.5">MATA-MATA</div>
            <div className="font-display text-xl">CHAVEAMENTO</div>
            <div className="font-serif-it text-sm text-ink-3">oitavas · quartas · semi · final</div>
          </div>
          <button onClick={() => navigate('/bracket')} className="btn-ink text-[11px] px-4 py-2.5 flex-shrink-0">
            VER →
          </button>
        </div>
      </div>

      {/* ── Marquee ── */}
      <div className="mt-6 border-t border-line bg-ink">
        <Marquee items={MARQUEE_ITEMS} color="#FFCB05" bg="#0D0D0D" speed={35} />
      </div>
    </div>
  )
}

// ─── Desktop ──────────────────────────────────────────────────────────────────

function HomeDesktop() {
  const navigate = useNavigate()
  const upcoming = MOCK_UPCOMING
  const days = daysUntil(TOURNAMENT_START)

  return (
    <div className="min-h-dvh bg-paper">
      <div className="max-w-screen-xl mx-auto px-6 py-8 space-y-5">

        {/* ── Hero row — 3 columns ── */}
        <div className="grid grid-cols-[1.5fr_1fr_0.9fr] gap-5">

          {/* Countdown card */}
          <div className="relative overflow-hidden min-h-[340px] border-2 border-ink">
            <img
              src={asset('assets/hero-jogadores.webp')}
              alt=""
              className="absolute inset-0 w-full h-full object-cover object-top"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-ink/90 via-ink/20 to-transparent" />
            <div className="relative h-full flex flex-col justify-end p-6">
              <div className="font-mono text-[10px] font-bold tracking-eyebrow text-paper/60 mb-2">
                COPA DO MUNDO 2026 · USA / CAN / MEX
              </div>
              <div className="flex items-end gap-4 mb-3">
                <div>
                  <div className="font-display text-[110px] leading-none text-paper">{days}</div>
                  <div className="font-display text-3xl text-paper/60 -mt-2">DIAS</div>
                </div>
                <div className="pb-2">
                  <div className="font-serif-it text-xl text-yellow">para a bola rolar</div>
                  <div className="font-mono text-[11px] text-paper/50 mt-1">Fase de grupos · 11 Jun · 15:00</div>
                </div>
              </div>
              <button onClick={() => navigate('/prediction')} className="btn-yellow w-fit">
                FAZER PALPITES AGORA →
              </button>
            </div>
          </div>

          {/* CTA — apostas abertas */}
          <div className="relative overflow-hidden border-2 border-ink flex flex-col justify-between p-6 bg-green">
            <div>
              <div className="font-mono text-[10px] tracking-eyebrow text-paper/60 mb-3">APOSTAS ABERTAS</div>
              <div className="leading-none">
                <div className="font-display text-[72px] text-paper leading-none">{upcoming.length}</div>
                <div className="font-display text-3xl text-paper">JOGOS</div>
                <div className="font-serif-it text-xl text-yellow mt-1">esperando você</div>
              </div>
            </div>
            <div>
              <p className="font-mono text-[11px] text-paper/60 mb-4 leading-relaxed">
                Não fique de fora. Cada jogo é ponto no bolso.
              </p>
              <button onClick={() => navigate('/prediction')} className="btn-yellow w-full justify-center">
                PALPITAR AGORA →
              </button>
            </div>
          </div>

          {/* Ranking — empty state */}
          <div className="border-2 border-ink flex flex-col">
            <div className="px-4 py-3 border-b border-hairline flex items-baseline justify-between">
              <div className="flex items-baseline gap-2">
                <span className="font-display text-lg">RANKING</span>
                <span className="font-serif-it text-sm text-ink-3">em breve</span>
              </div>
              <button onClick={() => navigate('/ranking')} className="font-mono text-[10px] text-ink-4 hover:text-ink">
                VER TUDO →
              </button>
            </div>
            <div className="flex-1 flex flex-col items-center justify-center p-6 text-center gap-3">
              <span className="font-display text-5xl text-ink-4">—</span>
              <p className="font-mono text-[11px] text-ink-3 leading-relaxed max-w-[160px]">
                Os pontos aparecem aqui quando os jogos começarem.
              </p>
            </div>
          </div>
        </div>

        {/* ── Secondary row ── */}
        <div className="grid grid-cols-[1.6fr_1fr_1fr] gap-5">

          {/* Upcoming matches */}
          <div className="border-2 border-ink">
            <div className="px-4 py-3 border-b border-hairline flex items-baseline gap-2">
              <span className="font-display text-lg">PRÓXIMOS</span>
              <span className="font-serif-it text-sm text-ink-3">jogos · grupo</span>
            </div>
            <div className="divide-y divide-hairline">
              {upcoming.slice(0, 6).map(match => (
                <button
                  key={match.id}
                  onClick={() => navigate('/prediction')}
                  className="w-full flex items-center gap-4 px-4 py-3 hover:bg-hairline transition-colors text-left group"
                >
                  <div className="flex-shrink-0 w-14 text-center">
                    <div className="font-mono text-[9px] text-ink-4 tracking-eyebrow">GRUPO {match.group}</div>
                  </div>
                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    <Flag team={match.home} size={26} />
                    <div className="min-w-0">
                      <div className="font-mono text-[12px] font-bold truncate">{match.home.name}</div>
                    </div>
                  </div>
                  <div className="text-center flex-shrink-0 px-2">
                    <div className="font-mono text-[9px] text-ink-4 tracking-eyebrow">{match.date}</div>
                    <div className="font-display text-lg leading-none">{match.time}</div>
                  </div>
                  <div className="flex items-center gap-2 flex-1 min-w-0 justify-end">
                    <div className="min-w-0 text-right">
                      <div className="font-mono text-[12px] font-bold truncate">{match.away.name}</div>
                    </div>
                    <Flag team={match.away} size={26} />
                  </div>
                  <span className="font-mono text-[10px] text-ink-4 group-hover:text-ink transition-colors flex-shrink-0">→</span>
                </button>
              ))}
            </div>
            {upcoming.length > 6 && (
              <button onClick={() => navigate('/prediction')} className="w-full px-4 py-2.5 font-mono text-[10px] text-ink-3 hover:text-ink tracking-eyebrow border-t border-hairline text-center">
                + {upcoming.length - 6} MAIS →
              </button>
            )}
          </div>

          {/* Bracket CTA */}
          <div className="border-2 border-ink flex flex-col">
            <div className="px-4 py-3 border-b border-hairline flex items-baseline gap-2">
              <span className="font-display text-lg">CHAVEAMENTO</span>
              <span className="font-serif-it text-sm text-ink-3">mata-mata</span>
            </div>
            <div className="flex-1 flex flex-col items-center justify-center p-6 text-center gap-4">
              <div className="font-mono text-[11px] text-ink-3 leading-relaxed">
                Oitavas a partir de 27 Jun. Palpite no mata-mata já disponível.
              </div>
              <button onClick={() => navigate('/bracket')} className="btn-yellow w-full justify-center">
                VER CHAVEAMENTO →
              </button>
            </div>
          </div>

          {/* Resenha CTA */}
          <div className="border-2 border-ink flex flex-col overflow-hidden">
            <div className="px-4 py-3 border-b border-hairline flex items-baseline justify-between">
              <div className="flex items-baseline gap-1.5">
                <span className="font-display text-lg">#RESENHA</span>
                <span className="font-serif-it text-sm text-ink-3">ao vivo</span>
              </div>
              <button onClick={() => navigate('/resenha')} className="font-mono text-[10px] text-ink-4 hover:text-ink">
                ENTRAR →
              </button>
            </div>
            <div className="flex-1 flex flex-col items-center justify-center p-6 text-center gap-3">
              <span className="font-display text-4xl text-ink-4">💬</span>
              <p className="font-mono text-[11px] text-ink-3 leading-relaxed">
                Nenhuma mensagem ainda. Seja o primeiro a entrar na resenha.
              </p>
              <button onClick={() => navigate('/resenha')} className="btn-ghost text-[10px]">
                ENTRAR NA RESENHA →
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ── Marquee ── */}
      <div className="border-t border-line bg-ink mt-4">
        <Marquee items={MARQUEE_ITEMS} color="#FFCB05" bg="#0D0D0D" speed={35} />
      </div>
    </div>
  )
}
