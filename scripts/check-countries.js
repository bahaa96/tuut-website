import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://oluyzqunbbqaxalodhdg.supabase.co';
const SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9sdXl6cXVuYmJxYXhhbG9kaGRnIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0NTQ1MzA5NywiZXhwIjoyMDYxMDI5MDk3fQ.lzKDE7OMCZFVkLt340TGwJ3Ak-29Ma16qAzky-2akyQ';

async function checkCountries() {
  const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);

  const { data: countries } = await supabase.from('countries').select('*');
  console.log('Available countries:');
  countries?.forEach(c => console.log(`- ${c.slug} (${c.name_en})`));

  const { data: deals } = await supabase.from('deals').select('country_slug').limit(5);
  console.log('\nExisting deal country_slugs:');
  deals?.forEach(d => console.log(`- ${d.country_slug}`));
}

checkCountries();