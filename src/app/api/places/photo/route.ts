import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const name = searchParams.get('name')

  if (!name || !name.startsWith('places/')) {
    return new NextResponse('Invalid photo name', { status: 400 })
  }

  const apiKey = process.env.GOOGLE_MAPS_API_KEY

  if (!apiKey) {
    return new NextResponse('Google Maps API key not configured', { status: 500 })
  }

  const url = `https://places.googleapis.com/v1/${name}/media?maxHeightPx=800&maxWidthPx=1200&key=${apiKey}&solution_id=gmp_git_agentskills_v1&skipHttpRedirect=false`

  try {
    const response = await fetch(url, {
      method: 'GET',
      redirect: 'follow',
    })

    if (!response.ok) {
      console.error(`Error fetching photo from Google Maps: ${response.statusText}`)
      return new NextResponse('Failed to fetch photo', { status: response.status })
    }

    // Proxy the image back to the client
    const contentType = response.headers.get('content-type') || 'image/jpeg'
    const arrayBuffer = await response.arrayBuffer()
    
    const headers = new Headers()
    headers.set('Content-Type', contentType)
    headers.set('Cache-Control', 'public, max-age=86400, s-maxage=86400, stale-while-revalidate=604800')

    return new NextResponse(arrayBuffer, {
      status: 200,
      headers,
    })

  } catch (error) {
    console.error('Photo proxy error:', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}
