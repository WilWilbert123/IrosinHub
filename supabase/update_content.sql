-- Run this in your Supabase SQL Editor to instantly update the About and Amenities for all 31 resorts!

-- Update Hot Springs
UPDATE public.resorts
SET 
  description = 'Experience the ultimate relaxation in our naturally heated thermal pools, sourced directly from the geothermal activity of the nearby Mount Bulusan volcano. Surrounded by lush tropical rainforest, our mineral-rich waters are known locally for their soothing and therapeutic properties—perfect for unwinding after a long week.',
  amenities = ARRAY['Thermal Hot Spring Pools', 'Open-air Nipa Cottages', 'Grilling Stations / BBQ Pits', 'Shower and Restroom Facilities', 'Spacious Parking']
WHERE water_type ILIKE '%Hot Spring%';

-- Update Cold Springs
UPDATE public.resorts
SET 
  description = 'Beat the tropical heat by taking a dip in our crystal-clear, emerald cold springs. Fed by pure, refreshing mountain water cascading from the Irosin highlands, this natural retreat offers a quiet, shaded sanctuary for families and nature lovers.',
  amenities = ARRAY['Natural Cold Spring Streams', 'Open-air Nipa Cottages', 'Grilling Stations / BBQ Pits', 'Clean Shower Facilities', 'Nature Trails']
WHERE water_type ILIKE '%Cold Spring%';

-- Update General Resorts (No specific water type)
UPDATE public.resorts
SET 
  description = 'A beautiful eco-tourism destination nestled in the heart of Irosin, Sorsogon. Enjoy a perfect weekend getaway with your family surrounded by pristine nature, fresh air, and excellent accommodations.',
  amenities = ARRAY['Swimming Pools', 'Overnight Air-conditioned Rooms', 'On-site Restaurant', 'Videoke / Karaoke', 'Secure Parking']
WHERE water_type IS NULL OR (water_type NOT ILIKE '%Hot Spring%' AND water_type NOT ILIKE '%Cold Spring%');
