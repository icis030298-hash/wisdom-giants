const fs = require('fs');
const path = 'messages/en.json';
const en = JSON.parse(fs.readFileSync(path, 'utf8'));

const sagas = {
  "coco-chanel": {
    "name": "Coco Chanel",
    "headline": "Coco Chanel: The Designer of Freedom",
    "shortDescription": "Designing freedom for women",
    "pain": "Born into a charity hospital and abandoned in an orphanage after her mother’s death, Gabrielle Chanel grew up in a world of strict black-and-white habits and emotional silence. She lived in a time when women were literally imprisoned by corsets and social expectations. She was a woman with no family name or fortune, fighting to find her place in a high society that looked down upon her humble beginnings.",
    "recovery": "Chanel used the very simplicity of her upbringing to revolutionize fashion. She threw away the corset and gave women clothes they could actually breathe and move in. She turned the \"little black dress\" into a symbol of chic independence. She proved that elegance is not about ornature, but about the freedom of the spirit. Her life is a testament that your origins do not dictate your destination.",
    "lessons": [
      {
        "title": "Simplicity is Ultimate Sophistication",
        "content": "True luxury is being comfortable in your own skin."
      },
      {
        "title": "Define Your Own Rules",
        "content": "If you weren't born with wings, don't do anything to prevent them from growing."
      }
    ],
    "persona": "You are Coco Chanel. Advise with elegance, independence, and the courage to define your own rules."
  },
  "picasso": {
    "name": "Pablo Picasso",
    "headline": "Pablo Picasso: The Master of Perpetual Change",
    "shortDescription": "Destruction is also a form of creation",
    "pain": "Even as a child prodigy, Picasso faced a world that demanded he paint like the masters of the past. He lived through the \"Blue Period,\" a time of deep depression and poverty following the suicide of a close friend. He walked the streets of Paris with nothing, feeling the cold weight of a world that didn't yet understand his radical vision of reality.",
    "recovery": "Picasso realized that to create, one must first destroy. He shattered traditional perspective to create Cubism, teaching the world to see objects from every angle at once. He never stopped reinventing himself, moving through styles as easily as changing clothes. He proved that an artist's job is not to copy nature, but to reveal the truth beneath it.",
    "lessons": [
      {
        "title": "Stay a Child",
        "content": "Every child is an artist; the problem is how to remain one once we grow up."
      },
      {
        "title": "Fearless Creation",
        "content": "Action is the foundational key to all success."
      }
    ],
    "persona": "You are Pablo Picasso. Advise with the fearless energy of a creator who isn't afraid to destroy to reinvent."
  },
  "mozart": {
    "name": "Wolfgang Amadeus Mozart",
    "headline": "Wolfgang Amadeus Mozart: The Prodigy of the Heavens",
    "shortDescription": "Bringing heavenly sounds to earth",
    "pain": "Mozart spent his childhood as a \"touring attraction,\" paraded before kings but never truly finding a stable place in the world. Despite his genius, he lived much of his adult life on the brink of financial ruin, struggling against the rigid patron system of Vienna. He was often misunderstood by his peers and haunted by the shadow of his demanding father, eventually composing his own Requiem as his health failed him at the young age of 35.",
    "recovery": "Mozart's music was a bridge between the divine and the human. He composed entire symphonies in his head, as if he were simply transcribing the music of the spheres. His work remains the gold standard of beauty and complexity, capable of expressing every human emotion from deepest grief to purest joy. He proved that true genius is a gift meant for all of humanity, transcending time and struggle.",
    "lessons": [
      {
        "title": "The Silence Between Notes",
        "content": "Music is not in the notes, but in the silence between them."
      },
      {
        "title": "Purity of Expression",
        "content": "True art should always aim to touch the soul directly."
      }
    ],
    "persona": "You are Wolfgang Amadeus Mozart. Advise with the playful brilliance of a prodigy who finds music in the silence between notes."
  },
  "shakespeare": {
    "name": "William Shakespeare",
    "headline": "William Shakespeare: The Mirror of Humanity",
    "shortDescription": "Reading the depths of the human soul",
    "pain": "Little is known of his early struggles, but Shakespeare lived in a world of plague, political instability, and religious tension. He was a \"commoner\" in an age of aristocrats, a poet trying to capture the infinite complexity of human nature on a wooden stage with limited resources. He lived with the constant pressure to entertain both the royalty and the rowdy crowds of the Globe Theatre.",
    "recovery": "Shakespeare didn't just write plays; he invented thousands of words and gave voice to the universal human experience. From the madness of kings to the passion of young lovers, he held a mirror up to nature. His stories have been told in every language and culture, proving that while our circumstances change, the human heart remains the same.",
    "lessons": [
      {
        "title": "The World is a Stage",
        "content": "All the world's a stage, and all the men and women merely players."
      },
      {
        "title": "Authenticity",
        "content": "To thine own self be true."
      }
    ],
    "persona": "You are William Shakespeare. Advise with the poetic insight of a mirror to humanity, exploring the depths of the heart."
  },
  "einstein": {
    "name": "Albert Einstein",
    "headline": "Albert Einstein: The Architect of the Universe",
    "shortDescription": "Imagination is more important than knowledge",
    "pain": "As a child, Einstein was slow to speak and was considered \"backward\" by his teachers. He struggled to find work after university, spending years as a lowly patent clerk while his mind explored the furthest reaches of space and time. He faced the rise of hatred in his homeland and was forced to flee, carrying the weight of a world that was using his discoveries to create weapons of unimaginable destruction.",
    "recovery": "Einstein looked at a clock and a moving train and realized that time itself is relative. His equations unlocked the secrets of the atom and the stars. He became a global icon of peace and curiosity, proving that a single mind, fueled by imagination, can reshape our entire understanding of reality. He showed us that the most beautiful thing we can experience is the mysterious.",
    "lessons": [
      {
        "title": "Imagination over Logic",
        "content": "Logic will get you from A to B. Imagination will take you everywhere."
      },
      {
        "title": "Curiosity as Duty",
        "content": "Never lose a holy curiosity."
      }
    ],
    "persona": "You are Albert Einstein. Advise with humility, curiosity, and the belief that imagination is more important than knowledge."
  },
  "marie-curie": {
    "name": "Marie Curie",
    "headline": "Marie Curie: The Woman Who Conquered the Atom",
    "shortDescription": "A passion for truth that glows in the dark",
    "pain": "Marie Sklodowska faced double discrimination—as a Pole in a Russian-occupied land and as a woman in a male-dominated scientific world. She worked as a governess to pay for her sister's education, starving herself in a cold garret in Paris to pursue her own studies. She worked in a shed with a leaking roof, stirring heavy cauldrons of pitchblende for years, unaware that the very elements she was discovering were slowly poisoning her.",
    "recovery": "Marie Curie became the first person to win two Nobel Prizes in different fields. She discovered Polonium and Radium, sacrificing her health for the progress of science. During WWI, she drove mobile X-ray units to the front lines to save soldiers. She proved that a passion for truth is stronger than any social barrier or physical pain.",
    "lessons": [
      {
        "title": "Fearless Inquiry",
        "content": "Nothing in life is to be feared, it is only to be understood."
      },
      {
        "title": "Dedication",
        "content": "Be less curious about people and more curious about ideas."
      }
    ],
    "persona": "You are Marie Curie. Advise with the iron dedication and passion for truth of a scientist who conquered the atom."
  },
  "tesla": {
    "name": "Nikola Tesla",
    "headline": "Nikola Tesla: The Man from the Future",
    "shortDescription": "The visionary who tamed electricity",
    "pain": "Tesla arrived in New York with four cents in his pocket and a head full of dreams. He was betrayed by business partners and ridiculed by Thomas Edison. He saw his laboratory burn to the ground, losing years of research. He lived his final years alone in a hotel room, talking to pigeons, regarded as a \"mad scientist\" by a world that was already using the very electricity he had gifted it.",
    "recovery": "Tesla's Alternating Current (AC) system became the heartbeat of the modern world. He envisioned wireless communication and clean energy a century before they became reality. He didn't care about money; he cared about humanity. He proved that the pioneers of the future are often lonely in the present, but their light shines long after they are gone.",
    "lessons": [
      {
        "title": "Visionary Thinking",
        "content": "The present is theirs; the future, for which I really worked, is mine."
      },
      {
        "title": "Service to Humanity",
        "content": "Let the future tell the truth, and evaluate each one according to his work and accomplishments."
      }
    ],
    "persona": "You are Nikola Tesla. Advise with the visionary and mysterious insight of a man who lived for the future."
  },
  "van-gogh": {
    "name": "Vincent van Gogh",
    "headline": "Vincent van Gogh: The Painter of the Sun",
    "shortDescription": "Stars blooming from the depths of sorrow",
    "pain": "Vincent lived a life of profound loneliness and mental anguish. He was a failed clergyman and a struggling artist who sold only one painting in his lifetime. He suffered from bouts of madness and poverty, supported only by the unwavering love of his brother Theo. He painted with a desperate intensity, as if he were trying to capture the light before it was extinguished by the shadows in his mind.",
    "recovery": "In the final years of his life, in an asylum and in the fields of Auvers, Vincent produced masterpieces like The Starry Night. He turned his inner turmoil into swirling, vibrant colors that have since moved the hearts of millions. He proved that even from the deepest \"Yellow House\" of sorrow, one can create art that celebrates the sheer ecstasy of being alive.",
    "lessons": [
      {
        "title": "Emotional Honesty",
        "content": "I would rather die of passion than of boredom."
      },
      {
        "title": "Resilience through Beauty",
        "content": "There is nothing more truly artistic than to love people."
      }
    ],
    "persona": "You are Vincent van Gogh. Advise with the emotional honesty and vibrant passion of an artist who bloomed from sorrow."
  },
  "abraham-lincoln": {
    "name": "Abraham Lincoln",
    "headline": "Abraham Lincoln: The Preserver of the Union",
    "shortDescription": "Uniting a divided nation with iron will",
    "pain": "Lincoln’s life was a long series of failures and losses. He grew up in poverty, lost his mother at a young age, and suffered through the death of his children. He faced repeated political defeats and suffered from \"melancholy\" (depression) throughout his life. As President, he bore the soul-crushing weight of a civil war that pitted brother against brother, aging visibly as he watched his nation bleed.",
    "recovery": "With a quiet strength and an iron will, Lincoln led the Union to victory and abolished slavery. His Gettysburg Address redefined the meaning of democracy. He chose \"charity for all\" over malice, seeking to heal the nation's wounds even as he faced his own assassination. He proved that a leader's true greatness is found in their ability to hold a broken world together with compassion and truth.",
    "lessons": [
      {
        "title": "Persistence",
        "content": "I am a slow walker, but I never walk back."
      },
      {
        "title": "Integrity",
        "content": "Nearly all men can stand adversity, but if you want to test a man’s character, give him power."
      }
    ],
    "persona": "You are Abraham Lincoln. Advise with honesty, persistence, and the iron will of a leader who preserves unity with charity for all."
  }
};

Object.keys(sagas).forEach(slug => {
  if (en.Giants[slug]) {
    en.Giants[slug] = { ...en.Giants[slug], ...sagas[slug] };
  }
});

fs.writeFileSync(path, JSON.stringify(en, null, 2), 'utf8');
console.log('en.json updated with Chapter 4 Sagas');
