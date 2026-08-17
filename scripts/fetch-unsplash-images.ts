import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error('Missing Supabase credentials in environment.')
  process.exit(1)
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)

const HOT_SPRING_IMAGES = [
  'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?q=80&w=1200&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1583416750470-965b2707b355?q=80&w=1200&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1605646194788-b21a8d052dcb?q=80&w=1200&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1540555700478-4be289fbecef?q=80&w=1200&auto=format&fit=crop'
]

const COLD_SPRING_IMAGES = [
  'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=1200&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1510414842594-a61c69b5ae57?q=80&w=1200&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1437719417032-8595fd9e9dc6?q=80&w=1200&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1496886007421-2a62886e0cce?q=80&w=1200&auto=format&fit=crop'
]

const NATURE_RESORT_IMAGES = [
  'https://images.unsplash.com/photo-1587595431973-160d0d94add1?q=80&w=1200&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?q=80&w=1200&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1510798831971-661eb04b3739?q=80&w=1200&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?q=80&w=1200&auto=format&fit=crop'
]

function getRandomImage(pool: string[]) {
  return pool[Math.floor(Math.random() * pool.length)]
}

async function main() {
  console.log('Fetching resorts from Supabase...')
  const { data: resorts, error } = await supabase.from('resorts').select('id, name, water_type, type')

  if (error || !resorts) {
    console.error('Failed to fetch resorts:', error)
    return
  }

  console.log(`Found ${resorts.length} resorts. Assigning Unsplash images...`)

  let updatedCount = 0

  for (const resort of resorts) {
    const isHot = resort.water_type?.toLowerCase().includes('hot') || resort.type?.toLowerCase().includes('hot')
    const isCold = resort.water_type?.toLowerCase().includes('cold') || resort.type?.toLowerCase().includes('cold')
    
    let imageUrl = getRandomImage(NATURE_RESORT_IMAGES)
    
    if (isHot && isCold) {
        imageUrl = Math.random() > 0.5 ? getRandomImage(HOT_SPRING_IMAGES) : getRandomImage(COLD_SPRING_IMAGES)
    } else if (isHot) {
        imageUrl = getRandomImage(HOT_SPRING_IMAGES)
    } else if (isCold) {
        imageUrl = getRandomImage(COLD_SPRING_IMAGES)
    }

    const { error: updateError } = await supabase
      .from('resorts')
      .update({ image_url: imageUrl })
      .eq('id', resort.id)
    
    if (updateError) {
      console.error(`Failed to update ${resort.name}:`, updateError)
    } else {
      updatedCount++
    }
  }

  console.log(`Done! Updated ${updatedCount} out of ${resorts.length} resorts with beautiful Unsplash images.`)
}

main().catch(console.error)
