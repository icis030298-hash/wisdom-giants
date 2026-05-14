import { giantsData } from '../data/giants';
import fs from 'fs';
import path from 'path';

const extract = () => {
  const translations: any = {};

  giantsData.forEach(g => {
    translations[g.slug] = {
      name: g.name,
      headline: g.headline,
      shortDescription: g.shortDescription,
      quote: g.quote,
      pain: g.pain,
      recovery: g.recovery,
      persona: g.persona,
      lessons: g.lessons.map(l => ({
        title: l.title,
        content: l.content
      }))
    };
  });

  console.log(JSON.stringify(translations, null, 2));
};

extract();
