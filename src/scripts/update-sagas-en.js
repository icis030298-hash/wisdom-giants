const fs = require('fs');
const path = 'messages/en.json';
const en = JSON.parse(fs.readFileSync(path, 'utf8'));

// UI Labels update
en.GiantsGrid.era = "Historical Giant";
en.GiantsGrid.readEpic = "Read Epic ✨";

const newSagas = {
  "steve-jobs": {
    "headline": "The Return of the Prodigal Visionary",
    "shortDescription": "The Icon of Innovation Who Dared to Think Different",
    "pain": "Imagine building a world-changing empire from your parents' garage, only to be publicly fired from it at the age of 30. In 1985, Steve Jobs faced a crushing humiliation that would have broken most. The very identity he had forged was stripped away, leaving him a \"public failure.\" He felt he had let the previous generation of entrepreneurs down, wandering in a wilderness of doubt for months, wondering if his best days were already behind him.",
    "recovery": "Yet, in the silence of his exile, Jobs realized he still loved his craft. This period of being a \"beginner\" again fueled a creative explosion, leading him to found NeXT and Pixar. When Apple eventually bought NeXT, Jobs returned to a dying company and transformed it into the most valuable entity on earth. He didn't just build gadgets; he built tools for the human spirit, proving that the most bitter medicine is often exactly what you need to heal and reinvent yourself.",
    "lessons": [
      {
        "title": "Stay Hungry, Stay Foolish",
        "content": "Never settle for 'good enough' and never lose your curiosity."
      },
      {
        "title": "Trust the Dots",
        "content": "You cannot connect the dots looking forward; you can only connect them looking backward."
      }
    ]
  },
  "napoleon": {
    "headline": "The Architect of Meritocracy",
    "shortDescription": "The Conqueror Who Rewrote the Rules of Fate",
    "pain": "Born as a minor noble on a tiny island, Napoleon entered a French military academy as an outsider who could barely speak the language. He was mocked for his accent and his stature, living in a society where your birth mattered more than your brain. He spent his youth in lonely study, feeling the weight of a world that had no place for an ambitious boy from Corsica. He saw a crumbling monarchy and a chaotic revolution, wondering if order could ever be restored by one who owned nothing but a sword.",
    "recovery": "Napoleon didn't wait for permission to lead; he took it. Through sheer brilliance and a work ethic that bypassed sleep, he rose to become Emperor, proving that talent belongs to those who use it. He modernized laws, education, and infrastructure across Europe. His \"Napoleonic Code\" remains the foundation of many legal systems today. He taught the world that \"impossible\" is a word found only in the dictionary of fools, and that destiny is something you seize, not something you receive.",
    "lessons": [
      {
        "title": "Merit Over Birth",
        "content": "Your background is just a starting point, not a ceiling."
      },
      {
        "title": "Speed is Everything",
        "content": "The greatest victories are won by those who decide and act the fastest."
      }
    ]
  },
  "king-sejong": {
    "headline": "The Light of the People",
    "shortDescription": "The Monarch Who Gifted a Nation Its Voice",
    "pain": "In 15th-century Joseon, King Sejong watched his people struggle to express their suffering. Laws were written in complex Chinese characters that only the elite could read, leaving the commoners helpless and illiterate. Sejong suffered from failing eyesight and chronic pain, yet his greatest agony was the intellectual darkness of his subjects. He faced fierce opposition from his own ministers, who believed that keeping the people ignorant was the only way to maintain order and tradition.",
    "recovery": "Working in secret, often by candlelight as his vision dimmed, Sejong created Hangeul—a phonetic alphabet so scientific that anyone could learn it in a day. It was an act of profound love and rebellion. By giving the people their own letters, he gave them power, dignity, and a shared identity. His reign became a golden age of science, music, and art. He proved that true leadership isn't about standing above the people, but about providing the light they need to stand on their own.",
    "lessons": [
      {
        "title": "Design for All",
        "content": "Innovation is meaningless if it is not accessible to everyone."
      },
      {
        "title": "Empowerment",
        "content": "The greatest legacy a leader can leave is the ability for others to speak for themselves."
      }
    ]
  },
  "elon-musk": {
    "headline": "The Architect of the Impossible",
    "shortDescription": "The Audacious Dreamer Pushing Humanity to the Stars",
    "pain": "In 2008, Elon Musk was on the brink of a total mental and financial collapse. Both SpaceX and Tesla were failing. Three rocket launches had ended in explosions, and the global financial crisis was strangling his remaining capital. He was forced to borrow money from friends just to pay rent, while the media gleefully predicted his downfall. He faced the very real possibility that his dreams of electric cars and Mars would die in a pile of ash and debt.",
    "recovery": "With the weight of the world on his shoulders, Musk pushed for one final, desperate launch. It succeeded. That single victory unlocked the funding that saved both companies. Today, he has revolutionized the space industry, accelerated the global transition to sustainable energy, and pushed the boundaries of brain-computer interfaces. His life is a testament to the fact that when something is important enough, you do it even if the odds are not in your favor.",
    "lessons": [
      {
        "title": "First Principles Thinking",
        "content": "Break problems down to their fundamental truths instead of reasoning by analogy."
      },
      {
        "title": "Resilience",
        "content": "Failure is an option here. If things are not failing, you are not innovating enough."
      }
    ]
  },
  "genghis-khan": {
    "headline": "The Master of Unity",
    "shortDescription": "The Outcast Who Built the Largest Land Empire in History",
    "pain": "Born as Temujin, his childhood was a nightmare of betrayal. His father was poisoned, and his tribe abandoned his family to starve on the frozen steppe. He spent his youth as a fugitive, even being enslaved in a wooden collar. He knew the bite of hunger and the sting of being forgotten by the world. His life was a constant battle for survival in a land where brother killed brother for a few heads of cattle.",
    "recovery": "Temujin realized that the only way to end the cycle of violence was to unite the warring tribes under a common law. He rose through merit, not bloodline, and transformed a group of fractured nomads into the most disciplined military force the world had ever seen. As Genghis Khan, he created a massive trade network (the Silk Road) and practiced religious tolerance centuries before it was common. He turned a world of chaos into a world of connection, proving that unity is the ultimate weapon against hardship.",
    "lessons": [
      {
        "title": "Adaptability",
        "content": "The strength of a wall is in its bricks; the strength of an army is in its discipline."
      },
      {
        "title": "Visionary Scale",
        "content": "Think beyond your tribe; the world is your true territory."
      }
    ]
  },
  "alexander-the-great": {
    "headline": "The King of Eternal Glory",
    "shortDescription": "The Young Lion Who Conquered the Known World",
    "pain": "Alexander grew up in the shadow of a powerful father, Philip II, constantly fearing that there would be no worlds left for him to conquer. At age 20, he inherited a kingdom surrounded by enemies and a restless army. He was a young man burdened with the impossible dream of blending the East and West into one civilization. Every step of his campaign was a gamble against superior numbers, harsh climates, and the constant threat of mutiny from men who just wanted to go home.",
    "recovery": "Alexander led from the front, always the first to charge into the breach. He didn't just conquer lands; he founded cities, spread Greek culture, and encouraged the mixing of traditions. From Egypt to the borders of India, his name became synonymous with unstoppable will. Though his life was short, he reshaped the map of the world forever. He proved that a short life of immense impact is worth more than a long life of quiet safety.",
    "lessons": [
      {
        "title": "Lead by Example",
        "content": "A leader's place is at the front of the charge, not in the safety of the rear."
      },
      {
        "title": "Transcend Borders",
        "content": "True greatness comes from bridging cultures, not just dominating them."
      }
    ]
  },
  "walt-disney": {
    "headline": "The Merchant of Dreams",
    "shortDescription": "The Man Who Turned Imagination Into an Empire",
    "pain": "Walt Disney was once fired by a newspaper editor who told him he \"lacked imagination and had no good ideas.\" His first animation studio went bankrupt, leaving him so poor he reportedly ate dog food to survive. He lost the rights to his first hit character, Oswald the Lucky Rabbit, and most of his staff deserted him. He stood in a train station, penniless and defeated, with nothing but a small suitcase and a drawing of a mouse.",
    "recovery": "That mouse, Mickey, became the foundation of a global empire. Walt pioneered the first full-length animated feature, Snow White, which critics called \"Disney's Folly\" and predicted would fail. Instead, it became a masterpiece. He went on to build Disneyland, the first true theme park, creating a place where adults and children could step into a world of wonder together. He proved that as long as you have a dream and the courage to pursue it, no failure is final.",
    "lessons": [
      {
        "title": "Perseverance",
        "content": "All our dreams can come true if we have the courage to pursue them."
      },
      {
        "title": "Quality First",
        "content": "Do what you do so well that they will want to see it again and bring their friends."
      }
    ]
  },
  "thomas-edison": {
    "headline": "The Wizard of Light",
    "shortDescription": "The Inventor Who Lit Up the Darkness",
    "pain": "Edison was told by his teachers that he was \"too stupid to learn anything.\" He was partially deaf and largely self-taught, working as a newsboy on trains while conducting dangerous chemistry experiments in his spare time. When he set out to create the electric light bulb, he faced thousands of failures. His laboratory burned down, his investors grew restless, and the world mocked him for trying to \"tame lightning\" in a glass jar.",
    "recovery": "Edison famously said, \"I have not failed. I've just found 10,000 ways that won't work.\" His relentless persistence eventually led to a practical incandescent bulb, changing human civilization forever by turning night into day. He didn't just invent products; he invented the modern industrial research lab. With over 1,000 patents, he showed the world that genius is 1% inspiration and 99% perspiration.",
    "lessons": [
      {
        "title": "Iterative Success",
        "content": "Every failure is simply a data point on the road to a solution."
      },
      {
        "title": "Hard Work",
        "content": "There is no substitute for hard work and relentless curiosity."
      }
    ]
  },
  "da-vinci": {
    "name": "Leonardo da Vinci",
    "quote": "Iron rusts from disuse; water loses its purity from stagnation... even so does inaction sap the vigors of the mind."
  },
  "seneca": {
    "name": "Seneca"
  }
};

Object.keys(newSagas).forEach(slug => {
  if (en.Giants[slug]) {
    en.Giants[slug] = { ...en.Giants[slug], ...newSagas[slug] };
  }
});

fs.writeFileSync(path, JSON.stringify(en, null, 2), 'utf8');
console.log('en.json updated successfully');
