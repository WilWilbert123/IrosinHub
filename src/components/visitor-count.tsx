import { createClient } from '@/lib/supabase/server'
import { Eye } from 'lucide-react'

export async function VisitorCount() {
  const supabase = await createClient()

  // We invoke the RPC to increment
  await supabase.rpc('increment_page_view', { page_id: 'global' })

  // Then fetch the latest count
  const { data, error } = await supabase
    .from('site_metrics')
    .select('visits')
    .eq('page_name', 'global')
    .single()

  const count = data?.visits || 0

  return (
    <div className="fixed bottom-6 right-6 z-50 text-sm text-muted-foreground flex items-center space-x-2 drop-shadow-md" title="Live Views">
      <span className="relative flex h-2 w-2">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
        <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
      </span>
      <div className="flex items-center gap-1.5 bg-zinc-100 dark:bg-zinc-800/50 px-3 py-1 rounded-full">
        <Eye className="h-4 w-4" />
        <span className="font-semibold text-foreground">{count.toLocaleString()}</span>
      </div>
    </div>
  )
}
