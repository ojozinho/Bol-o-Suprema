import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string
const explicitMockMode = import.meta.env.VITE_MOCK_AUTH === 'true'

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('[Supabase] Environment variables not set. Persistent product features are unavailable.')
}

export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseAnonKey || 'placeholder',
  {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true,
    },
  }
)

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey)
export const isExplicitMockMode = explicitMockMode
export const isMockMode = explicitMockMode || !isSupabaseConfigured

export async function uploadFile(
  userId: string,
  filename: string,
  file: File,
): Promise<string> {
  const maxBytes = 5 * 1024 * 1024
  const allowed = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
  if (file.size > maxBytes) throw new Error('Arquivo muito grande. Máximo: 5 MB.')
  if (!allowed.includes(file.type)) throw new Error('Formato inválido. Use JPEG, PNG, WebP ou GIF.')

  // Fixed path without extension — upsert:true always overwrites the SAME object,
  // so uploading a new photo/banner never leaves orphan files in storage.
  const path = `${userId}/${filename}`
  const primaryBucket = filename === 'banner' ? 'banners' : 'avatars'

  // Try dedicated bucket first; fall back to user-media for instances where the
  // storage migration (20260515143000) hasn't been applied yet.
  let lastError = ''
  for (const bucket of [primaryBucket, 'user-media']) {
    const { error } = await supabase.storage
      .from(bucket)
      .upload(path, file, { upsert: true, contentType: file.type })
    if (!error) {
      const { publicUrl } = supabase.storage.from(bucket).getPublicUrl(path).data
      return `${publicUrl}?v=${Date.now()}`
    }
    console.error(`[Storage] ${bucket}/${path}:`, error.message)
    lastError = error.message
  }

  throw new Error(`Falha ao enviar ${filename === 'banner' ? 'banner' : 'foto'}: ${lastError}`)
}
