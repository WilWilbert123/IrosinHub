import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

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

const LOCAL_IMAGES: Record<string, string> = {
  'mateo-hot-and-cold-spring-resort': '/resorts/san-benon.jpg',
}

export function getResortImage(resort: { image_url?: string | null, water_type?: string | null, type?: string | null, id: string, slug?: string }) {
  if (resort.slug && LOCAL_IMAGES[resort.slug]) {
    return LOCAL_IMAGES[resort.slug];
  }

  if (resort.image_url) {
    return resort.image_url.startsWith('places/') ? `/api/places/photo?name=${resort.image_url}` : resort.image_url;
  }
  
  // Use resort ID to deterministically pick a placeholder so it doesn't flicker on re-render
  const idHash = resort.id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  
  const isHot = resort.water_type?.toLowerCase().includes('hot') || resort.type?.toLowerCase().includes('hot');
  const isCold = resort.water_type?.toLowerCase().includes('cold') || resort.type?.toLowerCase().includes('cold');
  
  if (isHot && isCold) {
    const pool = idHash % 2 === 0 ? HOT_SPRING_IMAGES : COLD_SPRING_IMAGES;
    return pool[idHash % pool.length];
  } else if (isHot) {
    return HOT_SPRING_IMAGES[idHash % HOT_SPRING_IMAGES.length];
  } else if (isCold) {
    return COLD_SPRING_IMAGES[idHash % COLD_SPRING_IMAGES.length];
  }
  
  return NATURE_RESORT_IMAGES[idHash % NATURE_RESORT_IMAGES.length];
}
