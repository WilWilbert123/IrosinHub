import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
const GOOGLE_MAPS_API_KEY = process.env.GOOGLE_MAPS_API_KEY

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error('Missing Supabase credentials in environment.')
  process.exit(1)
}

if (!GOOGLE_MAPS_API_KEY) {
  console.error('Missing GOOGLE_MAPS_API_KEY in environment.')
  process.exit(1)
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)

async function fetchPlacePhotoName(query: string): Promise<string | null> {
  const url = 'https://places.googleapis.com/v1/places:searchText'
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Goog-Api-Key': GOOGLE_MAPS_API_KEY!,
      'X-Goog-FieldMask': 'places.name,places.photos',
      'X-Goog-Maps-Solution-ID': 'gmp_git_agentskills_v1'
    },
    body: JSON.stringify({
      textQuery: query,
      languageCode: 'en'
    })
  })

  if (!response.ok) {
    console.error(`Error fetching from Places API: ${response.statusText}`)
    const text = await response.text()
    console.error(text)
    return null
  }

  const data = await response.json()
  
  if (!data.places) {
    console.log('No places returned. Full response:', JSON.stringify(data, null, 2))
  }
  
  if (data.places && data.places.length > 0) {
    const place = data.places[0]
    if (place.photos && place.photos.length > 0) {
      return place.photos[0].name // e.g. places/PLACE_ID/photos/PHOTO_ID
    }
  }

  return null
}

async function main() {
  console.log('Fetching resorts from Supabase...')
  const { data: resorts, error } = await supabase.from('resorts').select('id, name')

  if (error || !resorts) {
    console.error('Failed to fetch resorts:', error)
    return
  }

  console.log(`Found ${resorts.length} resorts. Fetching photos...`)

  let updatedCount = 0

  for (const resort of resorts) {
    console.log(`Searching photo for: ${resort.name}...`)
    // Specific search string to target Irosin Sorsogon
    const query = `${resort.name} Irosin Sorsogon`
    const photoName = await fetchPlacePhotoName(query)

    if (photoName) {
      console.log(`Found photo reference: ${photoName}`)
      const { error: updateError } = await supabase
        .from('resorts')
        .update({ image_url: photoName })
        .eq('id', resort.id)
      
      if (updateError) {
        console.error(`Failed to update ${resort.name}:`, updateError)
      } else {
        updatedCount++
      }
    } else {
      console.log(`No photo found for ${resort.name}`)
    }

    // Small delay to respect rate limits
    await new Promise(resolve => setTimeout(resolve, 500))
  }

  console.log(`Done! Updated ${updatedCount} out of ${resorts.length} resorts.`)
}

main().catch(console.error)
