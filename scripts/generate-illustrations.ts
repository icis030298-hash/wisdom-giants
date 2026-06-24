import fs from "fs";
import path from "path";

// Define the mapping database for the 49 missing and 50 new giants
interface GiantMapping {
  name: string;
  mbti: string;
  icons: string[];
}

const GIANTS_MAP: Record<string, GiantMapping> = {
  // Existing missing giants (49)
  "max-planck": { name: "Max Planck", mbti: "INTJ", icons: ["Quantum physics symbol", "Thermodynamics formula"] },
  "hypatia": { name: "Hypatia", mbti: "INFJ", icons: ["Astrolabe", "Geometry scroll"] },
  "ibn-al-haytham": { name: "Ibn al-Haytham", mbti: "INTJ", icons: ["Camera obscura lens", "Light ray diagram"] },
  "blaise-pascal": { name: "Blaise Pascal", mbti: "INFP", icons: ["Pascaline mechanical calculator", "Probability dice"] },
  "dmitri-mendeleev": { name: "Dmitri Mendeleev", mbti: "INTP", icons: ["Periodic table chart", "Chemistry flask"] },
  "ada-lovelace": { name: "Ada Lovelace", mbti: "INFJ", icons: ["Analytical Engine gear", "Mathematical algorithm script"] },
  "alan-turing": { name: "Alan Turing", mbti: "INTP", icons: ["Turing machine tape", "Enigma codebreaker wheel"] },
  "charles-babbage": { name: "Charles Babbage", mbti: "INTJ", icons: ["Difference Engine gear", "Mathematical table"] },
  "ibn-sina": { name: "Ibn Sina", mbti: "INTJ", icons: ["Canon of Medicine manuscript", "Herbal medicine mortar"] },
  "james-watt": { name: "James Watt", mbti: "INTJ", icons: ["Steam engine piston", "Condenser blueprint"] },
  "george-stephenson": { name: "George Stephenson", mbti: "ESTJ", icons: ["Locomotive train wheel", "Railway track"] },
  "gregor-mendel": { name: "Gregor Mendel", mbti: "INTJ", icons: ["Pea plant flower", "Genetics Punnett square grid"] },
  "antoine-lavoisier": { name: "Antoine Lavoisier", mbti: "INTJ", icons: ["Oxygen combustion flask", "Chemical balance scale"] },
  "li-shizhen": { name: "Li Shizhen", mbti: "INFJ", icons: ["Materia Medica scroll", "Ginseng herb root"] },
  "guglielmo-marconi": { name: "Guglielmo Marconi", mbti: "ENTP", icons: ["Radio transmission antenna", "Telegraph key"] },
  "robert-koch": { name: "Robert Koch", mbti: "ISTJ", icons: ["Tuberculosis bacteria petri dish", "Microscope slide"] },
  "thomas-aquinas": { name: "Thomas Aquinas", mbti: "INFJ", icons: ["Summa Theologiae book", "Scribal quill and inkwell"] },
  "rumi": { name: "Rumi", mbti: "INFP", icons: ["Whirling dervish silhouette", "Poetry scroll"] },
  "ibn-rushd": { name: "Ibn Rushd", mbti: "INTJ", icons: ["Aristotelian commentary scroll", "Balance scales of justice"] },
  "william-james": { name: "William James", mbti: "ENFP", icons: ["Brain synapse diagram", "Stream of consciousness wave"] },
  "friedrich-schiller": { name: "Friedrich Schiller", mbti: "ENFP", icons: ["Ode to Joy musical notes", "Theatrical tragedy mask"] },
  "george-washington-carver": { name: "George Washington Carver", mbti: "INFJ", icons: ["Peanut plant root", "Soil chemistry flask"] },
  "al-ghazali": { name: "Al-Ghazali", mbti: "INFJ", icons: ["Sufi prayer rug", "Philosophical manuscript"] },
  "ibn-khaldun": { name: "Ibn Khaldun", mbti: "INTJ", icons: ["Muqaddimah history scroll", "Sociological civilization web"] },
  "maimonides": { name: "Maimonides", mbti: "INTJ", icons: ["Torah scroll", "Medical prescription script"] },
  "zoroaster": { name: "Zoroaster", mbti: "INFJ", icons: ["Sacred fire flame symbol", "Faravahar wing emblem"] },
  "miguel-de-cervantes": { name: "Miguel de Cervantes", mbti: "INFP", icons: ["Don Quixote windmill", "Scribal feather pen"] },
  "leo-tolstoy": { name: "Leo Tolstoy", mbti: "INFJ", icons: ["Peace dove with olive branch", "Peasant plow tool"] },
  "murasaki-shikibu": { name: "Murasaki Shikibu", mbti: "INFJ", icons: ["Genji Monogatari hand fan", "Japanese calligraphy brush"] },
  "edgar-degas": { name: "Edgar Degas", mbti: "ISTP", icons: ["Ballerina silhouette", "Impressionist paint brush"] },
  "oscar-wilde": { name: "Oscar Wilde", mbti: "ENFP", icons: ["Peacock feather", "Green carnation flower"] },
  "rabindranath-tagore": { name: "Rabindranath Tagore", mbti: "INFJ", icons: ["Gitanjali poetry book", "Lotus flower icon"] },
  "sor-juana-ines-de-la-cruz": { name: "Sor Juana Inés de la Cruz", mbti: "INFJ", icons: ["Library bookstack", "Scribal inkwell"] },
  "li-qingzhao": { name: "Li Qingzhao", mbti: "INFP", icons: ["Poetry scroll", "Plum blossom branch"] },
  "matsuo-basho": { name: "Matsuo Basho", mbti: "INFP", icons: ["Haiku calligraphy scroll", "Traveler straw hat"] },
  "william-wilberforce": { name: "William Wilberforce", mbti: "ENFJ", icons: ["Broken chains of slavery", "Parliamentary document scroll"] },
  "toussaint-louverture": { name: "Toussaint Louverture", mbti: "ENTJ", icons: ["Haitian freedom flag", "Cavalry sabre sword"] },
  "sojourner-truth": { name: "Sojourner Truth", mbti: "ENFJ", icons: ["Equality scales", "Freedom lantern torch"] },
  "emmeline-pankhurst": { name: "Emmeline Pankhurst", mbti: "ENFJ", icons: ["Votes for Women banner", "Suffragette prison gate key"] },
  "jose-rizal": { name: "José Rizal", mbti: "INFJ", icons: ["Noli Me Tangere book", "Ophthalmic surgeon scalpel"] },
  "mary-wollstonecraft": { name: "Mary Wollstonecraft", mbti: "INFJ", icons: ["Vindication of Rights book", "Equality scale balance"] },
  "lucretia-mott": { name: "Lucretia Mott", mbti: "INFJ", icons: ["Quaker bonnet silhouette", "Anti-slavery petition scroll"] },
  "marco-polo": { name: "Marco Polo", mbti: "ESTP", icons: ["Merchant sailing ship", "Silk Road route map"] },
  "vasco-da-gama": { name: "Vasco da Gama", mbti: "ESTP", icons: ["Portuguese caravel ship", "Nautical astrolabe"] },
  "ferdinand-magellan": { name: "Ferdinand Magellan", mbti: "ESTP", icons: ["Global route globe", "Nautical compass"] },
  "cornelius-vanderbilt": { name: "Cornelius Vanderbilt", mbti: "ENTJ", icons: ["Steamship wheel", "Railway track"] },
  "zhang-qian": { name: "Zhang Qian", mbti: "ENFJ", icons: ["Silk Road camel caravan", "Imperial envoy staff"] },
  "zheng-he": { name: "Zheng He", mbti: "ENTJ", icons: ["Ming Dynasty treasure ship", "Nautical chart scroll"] },
  "leif-erikson": { name: "Leif Erikson", mbti: "ESTP", icons: ["Viking longship prow", "Vinland map outline"] },

  // New giants added in Phase 3 (50)
  "charlemagne": { name: "Charlemagne", mbti: "ENTJ", icons: ["Frankish iron crown", "Imperial sword of state"] },
  "akbar-the-great": { name: "Akbar the Great", mbti: "ENFJ", icons: ["Mughal dome silhouette", "Interfaith discuss scroll"] },
  "pachacuti": { name: "Pachacuti", mbti: "ENTJ", icons: ["Machu Picchu masonry stone", "Inca sun god emblem"] },
  "queen-nzinga": { name: "Queen Nzinga", mbti: "ENTJ", icons: ["African warrior spear", "Diplomatic treaty scroll"] },
  "ramesses-ii": { name: "Ramesses II", mbti: "ENTJ", icons: ["Egyptian pharaoh crown", "War chariot wheel"] },
  "cyrus-the-great": { name: "Cyrus the Great", mbti: "ENFJ", icons: ["Cyrus Cylinder clay script", "Persian palace gate"] },
  "queen-elizabeth-i": { name: "Queen Elizabeth I", mbti: "INTJ", icons: ["Tudor rose crest", "Golden galleon ship"] },
  "frederick-the-great": { name: "Frederick the Great", mbti: "INTJ", icons: ["Prussian crown", "Transverse wood flute"] },
  "william-the-conqueror": { name: "William the Conqueror", mbti: "ENTJ", icons: ["Norman castle keep", "Doomsday Book manuscript"] },
  "giuseppe-garibaldi": { name: "Giuseppe Garibaldi", mbti: "ENFP", icons: ["Italian unification flag", "Red shirt emblem"] },
  "hatshepsut": { name: "Hatshepsut", mbti: "ENTJ", icons: ["Obelisk monument", "Punt expedition sailing ship"] },
  "zenobia": { name: "Zenobia", mbti: "ENTJ", icons: ["Palmyrene archway", "Iron battle helmet"] },
  "moctezuma-ii": { name: "Moctezuma II", mbti: "INFJ", icons: ["Aztec feather headdress", "Tenochtitlan temple pyramid"] },
  "tran-hung-dao": { name: "Tran Hung Dao", mbti: "ENTJ", icons: ["Vietnamese battle shield", "Bach Dang River stakes"] },
  "michael-faraday": { name: "Michael Faraday", mbti: "INTJ", icons: ["Electromagnetic coil copper wire", "Bunsen burner flame"] },
  "james-clerk-maxwell": { name: "James Clerk Maxwell", mbti: "INTJ", icons: ["Electromagnetic wave formula", "Color wheel spinner"] },
  "edward-jenner": { name: "Edward Jenner", mbti: "INTJ", icons: ["Smallpox vaccine syringe", "Dairy cow silhouette"] },
  "erwin-schrodinger": { name: "Erwin Schrödinger", mbti: "INTP", icons: ["Quantum cat box", "Wave equation symbol"] },
  "james-hutton": { name: "James Hutton", mbti: "INTJ", icons: ["Geological rock strata", "Unconformity cliff line"] },
  "georges-cuvier": { name: "Georges Cuvier", mbti: "INTJ", icons: ["Mastodon fossil jaw", "Comparative anatomy bone"] },
  "epicurus": { name: "Epicurus", mbti: "INFJ", icons: ["Greek garden gate", "Philosophical scroll"] },
  "diogenes": { name: "Diogenes", mbti: "INTP", icons: ["Philosopher ceramic tub", "Lantern in daylight"] },
  "heraclitus": { name: "Heraclitus", mbti: "INTP", icons: ["Flowing river wave", "Fire flame silhouette"] },
  "pythagoras": { name: "Pythagoras", mbti: "INTJ", icons: ["Right triangle geometry", "Musical lyre strings"] },
  "plotinus": { name: "Plotinus", mbti: "INFJ", icons: ["Mystic eye icon", "Neoplatonic sphere cycle"] },
  "john-stuart-mill": { name: "John Stuart Mill", mbti: "INTJ", icons: ["Liberty scale balance", "Utilitarian ledger book"] },
  "gottfried-leibniz": { name: "Gottfried Leibniz", mbti: "INTP", icons: ["Calculus integral sign", "Binary number grid"] },
  "meister-eckhart": { name: "Meister Eckhart", mbti: "INFJ", icons: ["Mystic light rays", "Gothic cathedral arch"] },
  "homer": { name: "Homer", mbti: "INFJ", icons: ["Iliad trojan horse", "Odyssey sailing ship rudder"] },
  "virgil": { name: "Virgil", mbti: "INFJ", icons: ["Aeneid epic shield", "Laurel wreath branch"] },
  "jane-austen": { name: "Jane Austen", mbti: "INFJ", icons: ["Regency bonnet cap", "Scribal inkwell quill"] },
  "charles-dickens": { name: "Charles Dickens", mbti: "ENFP", icons: ["Victorian street lantern", "Oliver Twist bowl icon"] },
  "rembrandt": { name: "Rembrandt", mbti: "ISFP", icons: ["Chiaroscuro paint palette", "Easel portrait frame"] },
  "francisco-de-goya": { name: "Francisco de Goya", mbti: "INFP", icons: ["War protest print plate", "Black painting brush"] },
  "franz-schubert": { name: "Franz Schubert", mbti: "INFP", icons: ["Music manuscript sheet", "Vienna salon piano key"] },
  "george-eliot": { name: "George Eliot", mbti: "INFJ", icons: ["Middlemarch book stack", "Victorian study quill"] },
  "emily-dickinson": { name: "Emily Dickinson", mbti: "INFP", icons: ["Pressed wildflower book", "Enclosed letter envelope"] },
  "henrik-ibsen": { name: "Henrik Ibsen", mbti: "INFJ", icons: ["Doll's House door key", "Theatre stage footlight"] },
  "dorothea-dix": { name: "Dorothea Dix", mbti: "INFJ", icons: ["Reformed asylum ward key", "Advocacy petition scroll"] },
  "clara-barton": { name: "Clara Barton", mbti: "INFJ", icons: ["Red cross bandage roll", "Battlefield medical kit"] },
  "ida-b-wells": { name: "Ida B. Wells", mbti: "ENFJ", icons: ["Journalist printing press", "Equality scales of justice"] },
  "elizabeth-cady-stanton": { name: "Elizabeth Cady Stanton", mbti: "ENFJ", icons: ["Declaration of Sentiments scroll", "Equality scale"] },
  "harriet-martineau": { name: "Harriet Martineau", mbti: "INFJ", icons: ["Sociological survey ledger", "Quill pen"] },
  "olympe-de-gouges": { name: "Olympe de Gouges", mbti: "ENFJ", icons: ["Declaration of Rights of Woman scroll", "Guillotine blade silhouette"] },
  "james-cook": { name: "James Cook", mbti: "ENTJ", icons: ["Pacific voyage route map", "Nautical sextant tool"] },
  "bartolomeu-dias": { name: "Bartolomeu Dias", mbti: "ESTP", icons: ["Cape of Good Hope storm wave", "Nautical astrolabe"] },
  "ernest-shackleton": { name: "Ernest Shackleton", mbti: "ENTJ", icons: ["Antarctic endurance ice ship", "Lifeboat rowing oar"] },
  "henry-hudson": { name: "Henry Hudson", mbti: "ENTJ", icons: ["Half Moon sailing ship", "Northern bay river chart"] },
  "vitus-bering": { name: "Vitus Bering", mbti: "ENTJ", icons: ["Bering Strait sea map", "Steller's sea cow sketch"] },
  "roald-amundsen": { name: "Roald Amundsen", mbti: "ENTJ", icons: ["South Pole flag marker", "Dog sled trail line"] }
};

const MASTER_PROMPT_TEMPLATE = `Modern digital illustration portrait of [HERO_NAME] for an MBTI-based personality platform.
Subject: Stylized portrait of [HERO_NAME], three-quarter view, looking at the viewer with a subtle smile. Historical garments simplified into clean blocks of color.
Art Style: Modern Vector Illustration, Flat Design with Depth, Isometric Isotype style. Outline-less (semi-flat design) with extremely clean edges. Smooth, matte textures, soft low-contrast gradients for depth.
Composition: Central composition. Below the character is a clean, stylized banner displaying the text "[MBTI_TYPE]" in bold, modern, sans-serif font. Floating stylized flat icons symbolise their work: [KEY_ICON_1], [KEY_ICON_2].
Color Scheme: Soft, vibrant but gentle pastel color scheme. Prioritize [COLOR_THEME] palette matching the MBTI type. Minimalist background with abstract geometric shapes in extremely soft focus. Soft studio lighting with gentle rim light.`;

async function main() {
  const imagesDir = path.resolve(process.cwd(), "public/images/giants");
  const existingFiles = fs.existsSync(imagesDir) ? fs.readdirSync(imagesDir) : [];
  
  const queue: { slug: string; mbti: string; prompt: string; targetFile: string }[] = [];
  
  // Collect all slugs we need to process
  // Let's scan all keys in GIANTS_MAP
  for (const slug of Object.keys(GIANTS_MAP)) {
    const targetFile = `illust_${slug}.png`;
    
    // Check if illustration already exists in public/images/giants
    if (existingFiles.includes(targetFile)) {
      continue;
    }
    
    const giant = GIANTS_MAP[slug];
    const isIntrovert = giant.mbti.startsWith("I");
    const colorTheme = isIntrovert 
      ? "cool pastel (e.g. pastel blues, mint greens, cool lavenders)" 
      : "warm pastel (e.g. soft corals, warm yellows, peach pinks)";
      
    // Interpolate prompt template
    let prompt = MASTER_PROMPT_TEMPLATE
      .replace(/\[HERO_NAME\]/g, giant.name)
      .replace(/\[MBTI_TYPE\]/g, giant.mbti)
      .replace(/\[KEY_ICON_1\]/g, giant.icons[0] || "signature icon")
      .replace(/\[KEY_ICON_2\]/g, giant.icons[1] || "symbolic object")
      .replace(/\[COLOR_THEME\]/g, colorTheme);
      
    queue.push({
      slug,
      mbti: giant.mbti,
      prompt,
      targetFile
    });
  }
  
  const outputPath = path.resolve(process.cwd(), "scratch/image-prompts-queue.json");
  fs.writeFileSync(outputPath, JSON.stringify(queue, null, 2), "utf8");
  console.log(`Generated prompts queue for ${queue.length} giants at: ${outputPath}`);
}

main().catch(console.error);
