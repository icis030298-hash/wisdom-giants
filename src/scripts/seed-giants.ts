import { createClient } from '@supabase/supabase-js';
import { GIANTS } from '../lib/data/giants';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function seed() {
  console.log('Seeding giants...');

  for (const giant of GIANTS) {
    const { data, error } = await supabase
      .from('giants')
      .upsert({
        name: giant.name,
        category: giant.category,
        slug: giant.slug,
        headline: giant.headline,
        quote: giant.quote,
        pain: giant.narrative.pain,
        recovery: giant.narrative.recovery,
        lessons: giant.narrative.lessons,
        persona: giant.persona,
      }, { onConflict: 'slug' });

    if (error) {
      console.error(`Error seeding ${giant.name}:`, error.message);
    } else {
      console.log(`Successfully seeded ${giant.name}`);
    }
  }

  console.log('Seeding complete!');
}

seed().catch(console.error);
