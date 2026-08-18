require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function run() {
  console.log("Deleting old Xander records...");
  const { data: d1, error: e1 } = await supabase.from('resorts').delete().in('slug', ['xanders-place-bulusan-view', 'xanders-private-resort']);
  if (e1) console.error("Error deleting:", e1);
  else console.log("Deleted old records.", d1);

  console.log("Fetching Monbon barangay id...");
  const { data: barangays, error: e2 } = await supabase.from('barangays').select('id').eq('name', 'Monbon').limit(1);
  const barangayId = barangays && barangays.length > 0 ? barangays[0].id : null;

  if (barangayId) {
    console.log("Upserting new Xander Place Resort...");
    const { data: d3, error: e3 } = await supabase.from('resorts').upsert([
      {
        barangay_id: barangayId,
        name: 'Xander Place Resort',
        slug: 'xander-place-resort',
        type: 'Private hot-spring villas',
        water_type: 'Hot Spring',
        phone: '059 416 4754',
        verification_status: 'verified_listing',
        operational_status: 'Open',
        location_address: 'Monbon, Irosin, Sorsogon'
      }
    ]);
    if (e3) console.error("Error upserting:", e3);
    else console.log("Successfully upserted new record.");
  } else {
    console.error("Monbon barangay not found.");
  }
}

run();
