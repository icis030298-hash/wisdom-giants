// 신규 50명 위인 MBTI 매핑 테이블
// dnaCode(커스텀) -> 표준 16 MBTI 타입 변환

const GIANT_MBTI_MAP = {
  // === 리더십 (14명) ===
  'charlemagne':          { mbti: 'ENTJ', icons: 'medieval crown, scepter, map of Europe' },
  'akbar-the-great':      { mbti: 'ENFJ', icons: 'Mughal arch, scroll, dove of peace' },
  'pachacuti':            { mbti: 'ENTJ', icons: 'Andean condor, stone temple, sun disk' },
  'queen-nzinga':         { mbti: 'ENTJ', icons: 'spear, African shield, trade route map' },
  'ramesses-ii':          { mbti: 'ESTJ', icons: 'pharaoh crown, pyramid, hieroglyphs' },
  'cyrus-the-great':      { mbti: 'ENFJ', icons: 'Cyrus cylinder, Persian arch, olive branch' },
  'queen-elizabeth-i':    { mbti: 'ENTJ', icons: 'royal orb, Tudor rose, compass' },
  'frederick-the-great':  { mbti: 'INTJ', icons: 'flute, military map, crown of Prussia' },
  'william-the-conqueror':{ mbti: 'ESTJ', icons: 'Norman castle, Bayeux tapestry, sword' },
  'giuseppe-garibaldi':   { mbti: 'ENFP', icons: 'red shirt, Italian flag, ship' },
  'hatshepsut':           { mbti: 'ENTJ', icons: 'pharaoh headdress, obelisk, incense tree' },
  'zenobia':              { mbti: 'ENTJ', icons: 'battle helm, Palmyra columns, bow and arrow' },
  'moctezuma-ii':         { mbti: 'ISFJ', icons: 'feather headdress, Aztec sun stone, jade' },
  'tran-hung-dao':        { mbti: 'INTJ', icons: 'bamboo scroll, Vietnamese war drum, lotus' },

  // === 과학 (6명) ===
  'michael-faraday':      { mbti: 'INTP', icons: 'electric coil, magnet, candle flame' },
  'james-clerk-maxwell':  { mbti: 'INTP', icons: 'electromagnetic wave, Saturn rings, equations' },
  'edward-jenner':        { mbti: 'ISFJ', icons: 'cowpox blossom, syringe, microscope' },
  'erwin-schrodinger':    { mbti: 'INTP', icons: 'cat silhouette, wave function, quantum box' },
  'james-hutton':         { mbti: 'INTJ', icons: 'geological rock layers, hammer, fossil' },
  'georges-cuvier':       { mbti: 'ISTJ', icons: 'fossil bones, magnifying glass, taxonomy book' },

  // === 철학 (8명) ===
  'epicurus':             { mbti: 'INFP', icons: 'garden, wine cup, friendship circle' },
  'diogenes':             { mbti: 'ENTP', icons: 'lantern, barrel, dog' },
  'heraclitus':           { mbti: 'INTJ', icons: 'river flame, river flow, sun and moon' },
  'pythagoras':           { mbti: 'INTJ', icons: 'triangle, lyre, star polygon' },
  'plotinus':             { mbti: 'INFJ', icons: 'ascending light beam, scroll, cosmos sphere' },
  'john-stuart-mill':     { mbti: 'ENFJ', icons: 'scales of justice, open book, sunflower' },
  'gottfried-leibniz':    { mbti: 'INTP', icons: 'binary digits, monad circle, calculus formula' },
  'meister-eckhart':      { mbti: 'INFJ', icons: 'mystical flame, open palms, dove' },

  // === 예술·문학 (10명) ===
  'homer':                { mbti: 'INFP', icons: 'lyre, laurel wreath, Trojan horse' },
  'virgil':               { mbti: 'INFP', icons: 'quill pen, bee, laurel branch' },
  'jane-austen':          { mbti: 'INFJ', icons: 'quill and inkwell, teacup, regency fan' },
  'charles-dickens':      { mbti: 'ENFP', icons: 'feather quill, Victorian lamp, theatre mask' },
  'rembrandt':            { mbti: 'ISFP', icons: 'palette and brush, chiaroscuro light, etching plate' },
  'francisco-de-goya':    { mbti: 'INTJ', icons: 'paintbrush, dark canvas, owl' },
  'franz-schubert':       { mbti: 'INFP', icons: 'music notes, piano keys, spectacles' },
  'george-eliot':         { mbti: 'INFJ', icons: 'open novel, ink quill, spinning wheel' },
  'emily-dickinson':      { mbti: 'INTP', icons: 'daisy flower, envelope letter, bee' },
  'henrik-ibsen':         { mbti: 'INTJ', icons: 'theatre stage, doll house, Norwegian fjord' },

  // === 사회·인권 (6명) ===
  'dorothea-dix':         { mbti: 'INFJ', icons: 'hospital lantern, caring hands, petition scroll' },
  'clara-barton':         { mbti: 'ISFJ', icons: 'red cross symbol, bandage, American flag' },
  'ida-b-wells':          { mbti: 'ENTJ', icons: 'printing press, pen, justice scales' },
  'elizabeth-cady-stanton':{ mbti: 'ENFJ', icons: 'declaration scroll, dove, women's badge' },
  'harriet-martineau':    { mbti: 'INTJ', icons: 'ear trumpet, open book, globe' },
  'olympe-de-gouges':     { mbti: 'ENFP', icons: 'tricolor ribbon, quill, rising sun' },

  // === 탐험 (6명) ===
  'james-cook':           { mbti: 'ISTJ', icons: 'sextant, world map, compass rose' },
  'bartolomeu-dias':      { mbti: 'ISTP', icons: 'caravel ship, Cape of Good Hope, navigation star' },
  'ernest-shackleton':    { mbti: 'ESTP', icons: 'ice ship, Antarctic compass, rope and anchor' },
  'henry-hudson':         { mbti: 'ISTP', icons: 'wooden ship, Hudson river map, telescope' },
  'vitus-bering':         { mbti: 'ISTJ', icons: 'sea chart, Bering strait map, anchor' },
  'roald-amundsen':       { mbti: 'INTJ', icons: 'South Pole flag, dog sled, compass' },
};

module.exports = { GIANT_MBTI_MAP };
