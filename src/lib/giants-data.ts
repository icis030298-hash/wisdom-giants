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
}

const colorMap: Record<string, string> = {
  '성취': 'from-amber-500/20 to-orange-500/20',
  '역경': 'from-rose-500/20 to-pink-500/20',
  '지혜': 'from-emerald-500/20 to-teal-500/20',
  '창의': 'from-purple-500/20 to-indigo-500/20',
};

export const giants: Giant[] = giantsData.map(g => ({
  id: g.slug,
  name: g.name,
  title: g.headline,
  era: '역사의 거인',
  field: g.category,
  description: g.shortDescription,
  quote: g.quote,
  color: colorMap[g.category] || 'from-slate-500/20 to-zinc-500/20',
  slug: g.slug,
  imageUrl: g.imageUrl.startsWith('/') 
    ? `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/giants/${g.slug}.jpg` 
    : g.imageUrl
}));

export const categories = [
  "All Giants",
  "성취",
  "역경",
  "지혜",
  "창의"
];
