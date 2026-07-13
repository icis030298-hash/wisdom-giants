const fs = require('fs');
const filePath = 'C:\\Users\\natey\\Desktop\\wisdom-giants\\src\\app\\[locale]\\page.tsx';
let content = fs.readFileSync(filePath, 'utf8');

const btCode = `
const blogTranslations: Record<string, any> = {
  ko: { sectionTitle: '지혜의 서재', sectionSubtitle: '운영자 칼럼 및 최신 소식', viewAll: '모두 보기', readTime: '분 소요', read: '읽기', 'CEO Column': '운영자 칼럼', 'News': '새소식', 'Notice': '공지' },
  en: { sectionTitle: "Wisdom's Library", sectionSubtitle: 'CEO Column & Latest News', viewAll: 'View All', readTime: 'min read', read: 'Read', 'CEO Column': 'CEO Column', 'News': 'News', 'Notice': 'Notice' },
  de: { sectionTitle: "Bibliothek der Weisheit", sectionSubtitle: 'CEO-Kolumne & Neuigkeiten', viewAll: 'Alle ansehen', readTime: 'min lesezeit', read: 'Lesen', 'CEO Column': 'CEO Kolumne', 'News': 'Neuigkeiten', 'Notice': 'Hinweis' },
  ja: { sectionTitle: "知恵の書斎", sectionSubtitle: '運営者コラム＆最新ニュース', viewAll: 'すべて見る', readTime: '分', read: '読む', 'CEO Column': 'コラム', 'News': 'ニュース', 'Notice': 'お知らせ' },
  es: { sectionTitle: "Biblioteca de Sabiduría", sectionSubtitle: 'Columna del CEO y Noticias', viewAll: 'Ver todo', readTime: 'min lectura', read: 'Leer', 'CEO Column': 'Columna', 'News': 'Noticias', 'Notice': 'Aviso' },
  fr: { sectionTitle: "Bibliothèque de Sagesse", sectionSubtitle: 'Chronique du CEO & Actualités', viewAll: 'Voir tout', readTime: 'min', read: 'Lire', 'CEO Column': 'Chronique', 'News': 'Actualités', 'Notice': 'Avis' },
  it: { sectionTitle: "Biblioteca della Saggezza", sectionSubtitle: 'Rubrica del CEO e Notizie', viewAll: 'Vedi tutti', readTime: 'min', read: 'Leggi', 'CEO Column': 'Rubrica', 'News': 'Notizie', 'Notice': 'Avviso' },
  pt: { sectionTitle: "Biblioteca da Sabedoria", sectionSubtitle: 'Coluna do CEO e Notícias', viewAll: 'Ver tudo', readTime: 'min leitura', read: 'Ler', 'CEO Column': 'Coluna', 'News': 'Notícias', 'Notice': 'Aviso' },
};
`;

if (!content.includes('const blogTranslations')) {
  content = content.replace('export default async function Home', btCode + '\nexport default async function Home');
  fs.writeFileSync(filePath, content);
  console.log("Injected blogTranslations into page.tsx");
} else {
  console.log("Already has blogTranslations");
}
