import { giantsData } from "@/data/giants";

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
  category: string; // Add category ID
}

const colorMap: Record<string, string> = {
  'achievement': 'from-amber-500/20 to-orange-500/20',
  'adversity': 'from-rose-500/20 to-pink-500/20',
  'wisdom': 'from-emerald-500/20 to-teal-500/20',
  'creativity': 'from-purple-500/20 to-indigo-500/20',
};

const categoryMap: Record<string, string> = {
  '성취': 'achievement',
  '역경': 'adversity',
  '지혜': 'wisdom',
  '창의': 'creativity',
};

export const giants: Giant[] = giantsData.map(g => ({
  id: g.slug,
  name: g.name,
  title: g.headline,
  era: 'era',
  field: categoryMap[g.category] || 'other',
  description: g.shortDescription,
  quote: g.quote,
  color: colorMap[categoryMap[g.category]] || 'from-slate-500/20 to-zinc-500/20',
  slug: g.slug,
  imageUrl: g.imageUrl.startsWith('/images/')
    ? g.imageUrl
    : g.imageUrl.startsWith('/') 
      ? `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/giants/${g.slug}.jpg` 
      : g.imageUrl,
  category: categoryMap[g.category] || 'other'
}));

export const categories = [
  "All Giants",
  "achievement",
  "adversity",
  "wisdom",
  "creativity"
];
