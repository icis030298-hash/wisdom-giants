import { giantsData } from "@/data/giants";
import { regionsMap } from "@/data/regions-map";

export interface Giant {
  id: string;
  name: string;
  title: string;
  era: string;
  field: string;
  description: string;
  quote: string;
  color: string;
  slug: string; // Keep slug for detail links
  imageUrl: string;
  dnaCode: string;
  category: string; // Add category ID
  lessons?: any[];
  region?: 'east-asia' | 'europe' | 'americas' | 'middle-east-turkey' | 'africa' | 'south-southeast-asia';
}

const colorMap: Record<string, string> = {
  'leadership': 'from-amber-500/20 to-orange-500/20',
  'science': 'from-cyan-500/20 to-blue-500/20',
  'philosophy': 'from-emerald-500/20 to-teal-500/20',
  'arts': 'from-purple-500/20 to-pink-500/20',
  'society': 'from-rose-500/20 to-red-500/20',
  'business': 'from-indigo-500/20 to-violet-500/20',
};

export const giants: Giant[] = giantsData
  .map(g => ({
    id: g.slug,
    name: g.name,
    title: g.headline,
    era: g.era,
    field: g.category,
    description: g.shortDescription,
    quote: g.quote,
    color: colorMap[g.category] || 'from-slate-500/20 to-zinc-500/20',
    slug: g.slug,
    dnaCode: g.dnaCode,
    imageUrl: g.imageUrl.startsWith('/images/')
      ? g.imageUrl
      : g.imageUrl.startsWith('/') 
        ? `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/giants/${g.slug}.jpg` 
        : g.imageUrl,
    category: g.category,
    lessons: g.lessons,
    region: regionsMap[g.slug]
  }))
  .filter(g => g.id && g.id.trim().length > 0);

export const categories = [
  "All Giants",
  "leadership",
  "science",
  "philosophy",
  "arts",
  "society",
  "business"
];
