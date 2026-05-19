import { useState } from 'react'
import { motion } from 'framer-motion'
import type { ChatPoll } from '@/types'

interface PollModalProps {
  onCreate: (poll: ChatPoll) => void
  onClose: () => void
}

export function PollModal({ onCreate, onClose }: PollModalProps) {
  const [question, setQuestion] = useState('')
  const [options,  setOptions]  = useState(['', ''])

  const setOpt = (i: number, v: string) => setOptions(opts => opts.map((o, j) => j === i ? v : o))
  const addOpt = () => { if (options.length < 5) setOptions(o => [...o, '']) }

  const submit = () => {
    const q    = question.trim()
    const opts = options.map(o => o.trim()).filter(Boolean)
    if (!q || opts.length < 2) return
    onCreate({
      question: q,
      options:  opts.map((text, i) => ({ id: `opt-${i}`, text })),
      votes:    {},
    })
  }

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-ink/60 backdrop-blur-sm px-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.94, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.94, opacity: 0 }}
        transition={{ type: 'spring', stiffness: 340, damping: 26 }}
        className="bg-paper border-2 border-ink w-full max-w-sm p-6 flex flex-col gap-4"
        onClick={e => e.stopPropagation()}
      >
        <div>
          <div className="font-display text-xl text-ink leading-none">NOVA ENQUETE</div>
          <div className="font-mono text-[10px] text-ink-4 mt-1">só admins podem criar</div>
        </div>

        <input
          value={question}
          onChange={e => setQuestion(e.target.value)}
          placeholder="Pergunta da enquete..."
          className="border border-hairline bg-paper-deep px-3 py-2.5 font-sans text-[14px] outline-none focus:border-ink w-full"
        />

        <div className="flex flex-col gap-2">
          {options.map((opt, i) => (
            <input
              key={i}
              value={opt}
              onChange={e => setOpt(i, e.target.value)}
              placeholder={`Opção ${i + 1}`}
              className="border border-hairline bg-paper-deep px-3 py-2 font-sans text-[13px] outline-none focus:border-ink w-full"
            />
          ))}
          {options.length < 5 && (
            <button
              onClick={addOpt}
              className="font-mono text-[10px] text-ink-3 hover:text-ink border border-dashed border-hairline py-2 transition-colors"
            >
              + OPÇÃO
            </button>
          )}
        </div>

        <div className="flex gap-2 pt-1">
          <button
            onClick={onClose}
            className="flex-1 font-mono text-[11px] tracking-widest py-3 border border-hairline text-ink-3 hover:border-ink hover:text-ink transition-colors"
          >
            CANCELAR
          </button>
          <button
            onClick={submit}
            disabled={!question.trim() || options.filter(o => o.trim()).length < 2}
            className="flex-1 font-mono text-[11px] tracking-widest py-3 bg-yellow text-ink border border-ink hover:bg-yellow/80 transition-colors disabled:opacity-40"
          >
            CRIAR
          </button>
        </div>
      </motion.div>
    </motion.div>
  )
}
