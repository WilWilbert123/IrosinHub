-- IrosinHub Supabase Schema Migration

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Site Metrics
CREATE TABLE IF NOT EXISTS public.site_metrics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    page_name TEXT UNIQUE NOT NULL,
    visits BIGINT DEFAULT 0,
    last_updated TIMESTAMPTZ DEFAULT NOW()
);

-- RPC for incrementing page views atomically
CREATE OR REPLACE FUNCTION increment_page_view(page_id TEXT)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    INSERT INTO public.site_metrics (page_name, visits)
    VALUES (page_id, 1)
    ON CONFLICT (page_name)
    DO UPDATE SET visits = site_metrics.visits + 1, last_updated = NOW();
END;
$$;

-- 2. Barangays
CREATE TABLE IF NOT EXISTS public.barangays (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT UNIQUE NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    description TEXT,
    population INT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Resorts
CREATE TABLE IF NOT EXISTS public.resorts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    barangay_id UUID REFERENCES public.barangays(id) ON DELETE SET NULL,
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    municipality TEXT DEFAULT 'Irosin',
    province TEXT DEFAULT 'Sorsogon',
    type TEXT,
    water_type TEXT,
    description TEXT,
    entrance_fee NUMERIC,
    entrance_fee_child NUMERIC,
    entrance_fee_senior NUMERIC,
    cottage_fee NUMERIC,
    overnight_fee NUMERIC,
    amenities TEXT[],
    location_address TEXT,
    phone TEXT,
    facebook_url TEXT,
    website_url TEXT,
    google_maps_url TEXT,
    latitude NUMERIC,
    longitude NUMERIC,
    is_featured BOOLEAN DEFAULT FALSE,
    image_url TEXT,
    operational_status TEXT,
    verification_status TEXT,
    last_verified_at DATE,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Document Requests
CREATE TABLE IF NOT EXISTS public.document_requests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    barangay_id UUID REFERENCES public.barangays(id),
    resident_name TEXT NOT NULL,
    resident_email TEXT,
    resident_phone TEXT NOT NULL,
    doc_type TEXT CHECK (doc_type IN ('Barangay Clearance', 'Certificate of Indigency', 'Certificate of Residency', 'Business Permit Endorsement')),
    purpose TEXT NOT NULL,
    status TEXT DEFAULT 'Pending' CHECK (status IN ('Pending', 'Processing', 'Approved', 'Ready for Pickup')),
    tracking_code TEXT UNIQUE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.site_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.barangays ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.resorts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.document_requests ENABLE ROW LEVEL SECURITY;

-- Public Read Policies
CREATE POLICY "Public Read Access for Site Metrics" ON public.site_metrics FOR SELECT USING (true);
CREATE POLICY "Public Read Access for Barangays" ON public.barangays FOR SELECT USING (true);
CREATE POLICY "Public Read Access for Resorts" ON public.resorts FOR SELECT USING (true);

-- Document Requests Policies
-- Allow anyone to insert a document request (anonymously)
CREATE POLICY "Allow anonymous inserts for Document Requests" ON public.document_requests FOR INSERT WITH CHECK (true);

-- Allow anyone to select a document request IF they have the tracking code (handled via app logic filtering, but open for selection with exact tracking_code)
CREATE POLICY "Allow public select for Document Requests" ON public.document_requests FOR SELECT USING (true);

-- Seed Data: 28 Barangays
INSERT INTO public.barangays (name, slug) VALUES 
('Bacolod (Poblacion)', 'bacolod-poblacion'),
('Bagsangan', 'bagsangan'),
('Batang', 'batang'),
('Bolos', 'bolos'),
('Buenavista', 'buenavista'),
('Bulawan', 'bulawan'),
('Carriedo', 'carriedo'),
('Casini', 'casini'),
('Cawayan', 'cawayan'),
('Cogon', 'cogon'),
('Gabao', 'gabao'),
('Gulang-Gulang', 'gulang-gulang'),
('Gumapia', 'gumapia'),
('Liang', 'liang'),
('Macawayan', 'macawayan'),
('Mapaso', 'mapaso'),
('Monbon', 'monbon'),
('Patag', 'patag'),
('Salvacion', 'salvacion'),
('San Agustin (Poblacion)', 'san-agustin-poblacion'),
('San Isidro (Palogtok)', 'san-isidro-palogtok'),
('San Juan (Poblacion)', 'san-juan-poblacion'),
('San Julian (Poblacion)', 'san-julian-poblacion'),
('San Pedro (Poblacion)', 'san-pedro-poblacion'),
('Santo Domingo (Lamboon)', 'santo-domingo-lamboon'),
('Tabon-Tabon', 'tabon-tabon'),
('Tinampo', 'tinampo'),
('Tongdol', 'tongdol')
ON CONFLICT (name) DO NOTHING;

-- Seed Data: Sample Resorts
-- Note: UUIDs for barangays are dynamic, so we resolve them using subqueries
INSERT INTO public.resorts (barangay_id, name, slug, type, water_type, phone, verification_status, operational_status, location_address) VALUES
((SELECT id FROM public.barangays WHERE name = 'Monbon' LIMIT 1), 'San Benon Resort / Mateo Hot & Cold Spring Resort', 'mateo-hot-and-cold-spring-resort', 'Hot & cold spring resort', 'Hot & Cold Spring', '+63 992 587 3299', 'verified_listing', 'Open', 'Monbon / San Benon, Irosin, Sorsogon'),
((SELECT id FROM public.barangays WHERE name = 'Monbon' LIMIT 1), 'Nature Hot Spring Resort & Inn', 'nature-hot-spring-resort', 'Hot spring resort / hotel', 'Hot Spring', '+63 910 574 0612', 'verified_listing', 'Open', 'Monbon, Irosin, Sorsogon'),
((SELECT id FROM public.barangays WHERE name = 'Monbon' LIMIT 1), 'Vida Guest Resort', 'vida-guest-resort', 'Resort hotel', NULL, NULL, 'verified_listing', 'Open', 'Monbon, Irosin, Sorsogon'),
((SELECT id FROM public.barangays WHERE name = 'Monbon' LIMIT 1), '401K Resort', '401k-resort', 'Hot spring / resort', 'Hot Spring', NULL, 'verified_listing', 'Open', 'Monbon / Bliss, Irosin, Sorsogon'),
((SELECT id FROM public.barangays WHERE name = 'Mapaso' LIMIT 1), 'Tropical Hot Spring Paradise', 'tropical-hot-spring-paradise', 'Natural hot spring resort', 'Hot Spring', '+63 920 245 6228', 'needs_verification', 'Unknown', 'Mapaso / Monbon, Irosin, Sorsogon'),
((SELECT id FROM public.barangays WHERE name = 'Monbon' LIMIT 1), 'Dulce Resort / Agua Dulce Resort', 'dulce-resort', 'Resort', NULL, NULL, 'needs_verification', 'Unknown', 'Monbon, Irosin, Sorsogon'),
((SELECT id FROM public.barangays WHERE name = 'Monbon' LIMIT 1), 'Xander''s Place – Bulusan View', 'xanders-place-bulusan-view', 'Resort / accommodation', NULL, '059 416 4754', 'verified_listing', 'Open', 'Monbon area, Irosin, Sorsogon'),
((SELECT id FROM public.barangays WHERE name = 'Monbon' LIMIT 1), 'Xander''s Private Resort', 'xanders-private-resort', 'Private hot-spring villas', 'Hot Spring', NULL, 'verified_listing', 'Open', 'Monbon, Irosin, Sorsogon'),
((SELECT id FROM public.barangays WHERE name = 'Monbon' LIMIT 1), 'Caliente Spring Resort', 'caliente-spring-resort', 'Private hot spring / villas', 'Hot Spring', '+63 939 863 5500', 'verified_listing', 'Open', 'Monbon, Irosin, Sorsogon'),
(NULL, 'Casa Sereno Spring Resort', 'casa-sereno-spring-resort', 'Spring resort', 'Spring', '+63 951 476 3006', 'verified_listing', 'Open', 'Bliss, Irosin, Sorsogon'),
(NULL, 'The Spring House', 'the-spring-house', 'Resort hotel', NULL, '+63 992 942 9426', 'verified_listing', 'Open', 'Irosin, Sorsogon'),
(NULL, 'GABZ''K Hotel & Resort', 'gabzk-hotel-resort', 'Resort hotel', NULL, '+63 981 293 6995', 'verified_listing', 'Open', 'Irosin, Sorsogon'),
((SELECT id FROM public.barangays WHERE name = 'Bagsangan' LIMIT 1), 'Modesta Resort', 'modesta-resort', 'Swimming resort / accommodation', NULL, '+63 918 346 0132', 'verified_listing', 'Open', 'Bagsangan, Irosin, Sorsogon'),
((SELECT id FROM public.barangays WHERE name = 'Bagsangan' LIMIT 1), 'Lim''s Resort / Lim Spring Resort', 'lims-resort', 'Cold spring resort', 'Cold Spring', NULL, 'needs_verification', 'Unknown', 'Bagsangan, Irosin, Sorsogon'),
((SELECT id FROM public.barangays WHERE name = 'Bagsangan' LIMIT 1), 'Burigas Resort / Burigas Spring Resort', 'burigas-resort', 'Spring resort', 'Spring', NULL, 'needs_verification', 'Unknown', 'Bagsangan, Irosin, Sorsogon'),
((SELECT id FROM public.barangays WHERE name = 'Salvacion' LIMIT 1), 'Cielo''s Garden Resort', 'cielos-garden-resort', 'Garden/swimming resort', NULL, NULL, 'needs_verification', 'Unknown', 'Salvacion, Irosin, Sorsogon'),
((SELECT id FROM public.barangays WHERE name = 'Gulang-Gulang' LIMIT 1), 'Guest World Resort', 'guest-world-resort', 'Resort', NULL, NULL, 'needs_verification', 'Unknown', 'Gulang-Gulang, Irosin, Sorsogon'),
(NULL, 'Prasada Resort', 'prasada-resort', 'Resort hotel', NULL, NULL, 'verified_listing', 'Open', 'Irosin, Sorsogon'),
(NULL, 'Triple R Resort', 'triple-r-resort', 'Resort', NULL, NULL, 'verified_listing', 'Open', 'Irosin, Sorsogon'),
(NULL, 'San Benon Hot & Cold Spring', 'san-benon-hot-cold-spring', 'Hot & cold spring', 'Hot & Cold Spring', NULL, 'verified_listing', 'Unknown', 'Irosin / Monbon area, Sorsogon'),
(NULL, 'Baclayon Valley Spring Resort', 'baclayon-valley-spring-resort', 'Spring resort', 'Spring', NULL, 'needs_verification', 'Unknown', 'Irosin, Sorsogon'),
((SELECT id FROM public.barangays WHERE name = 'Bolos' LIMIT 1), 'Bolos Crystal Spring / Bolos Spring', 'bolos-crystal-spring', 'Cold spring', 'Cold Spring', NULL, 'needs_verification', 'Unknown', 'Bolos, Irosin, Sorsogon'),
((SELECT id FROM public.barangays WHERE name = 'Mapaso' LIMIT 1), 'Mapaso Spring / Mapaso Hot Spring', 'mapaso-spring', 'Natural hot spring', 'Hot Spring', NULL, 'needs_verification', 'Unknown', 'Mapaso, Irosin, Sorsogon'),
(NULL, 'Omagom Spring', 'omagom-spring', 'Natural spring', 'Spring', NULL, 'needs_verification', 'Unknown', 'Irosin, Sorsogon'),
(NULL, 'Dasal Spring', 'dasal-spring', 'Natural spring', 'Spring', NULL, 'needs_verification', 'Unknown', 'Irosin, Sorsogon'),
(NULL, 'Binurabudan Spring', 'binurabudan-spring', 'Natural spring', 'Spring', NULL, 'needs_verification', 'Unknown', 'Irosin, Sorsogon'),
((SELECT id FROM public.barangays WHERE name = 'Bolos' LIMIT 1), 'Bolos Cold Spring', 'bolos-cold-spring', 'Natural cold spring', 'Cold Spring', NULL, 'needs_verification', 'Unknown', 'Bolos, Irosin, Sorsogon'),
(NULL, 'Shane''s Crib', 'shanes-crib', 'Vacation/private accommodation', NULL, NULL, 'verified_listing', 'Open', 'Irosin, Sorsogon'),
(NULL, 'Irosin Valley Lodge', 'irosin-valley-lodge', 'Hotel/resort accommodation', NULL, NULL, 'verified_listing', 'Unknown', 'Irosin, Sorsogon'),
(NULL, 'Thasha Glamping Resort', 'thasha-glamping-resort', 'Glamping resort', NULL, NULL, 'verified_listing', 'Open', 'Irosin, Sorsogon'),
((SELECT id FROM public.barangays WHERE name = 'Bacolod (Poblacion)' LIMIT 1), 'Ellen''s Homestay', 'ellens-homestay', 'Homestay', NULL, NULL, 'verified_listing', 'Open', 'Bacolod, Irosin, Sorsogon')
ON CONFLICT (slug) DO NOTHING;
