import { motion } from 'framer-motion'
import { isSafeHttpUrl } from '@/lib/security'

export function ImageViewer({ url, onClose }: { url: string; onClose: () => void }) {
  if (!isSafeHttpUrl(url)) return null
  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-ink/92 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <img src={url} alt="Foto" className="max-w-full max-h-full object-contain rounded-lg shadow-2xl" />
    </motion.div>
  )
}
