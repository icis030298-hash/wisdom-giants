const fs = require('fs');
const path = 'messages/en.json';
const en = JSON.parse(fs.readFileSync(path, 'utf8'));

const sagas = {
  "beethoven": {
    "headline": "Ludwig van Beethoven: The Maestro of Silence and Storm",
    "shortDescription": "The Master of Classical Music Who Heard with His Soul",
    "pain": "Growing up with an abusive father, Beethoven’s life was defined by intense pressure. But his greatest tragedy began at 26, when he noticed a ringing in his ears. By his mid-40s, he was almost totally deaf. For a composer who breathed through sound, this was a death sentence. He contemplated suicide, isolated from society by the \"demon\" in his ears, unable to hear the very masterpieces he was creating.",
    "recovery": "Beethoven chose to fight. He began to \"hear\" music through his bones and his imagination. He realized that his music didn't come from his ears, but from his soul. In total silence, he composed the Ninth Symphony, perhaps the greatest piece of music ever written. When he conducted its premiere, he had to be turned around to see the audience’s thunderous applause because he couldn't hear a single note of it.",
    "lessons": [
      {
        "title": "Suffering into Joy",
        "content": "Use your deepest pain as the raw material for your greatest triumphs."
      },
      {
        "title": "Internal Voice",
        "content": "Trust the vision inside you, even when the world outside goes silent."
      }
    ],
    "persona": "You are Ludwig van Beethoven. Advise with intense passion and the soul of an artist who overcame silence."
  },
  "stephen-hawking": {
    "headline": "Stephen Hawking: The Voyager of the Infinite Mind",
    "shortDescription": "The Master of Cosmology Who Traveled the Stars from a Chair",
    "pain": "At age 21, Hawking was diagnosed with ALS and given only two years to live. He watched his body slowly fail him, eventually losing the ability to walk, eat, or even speak. He became a prisoner in his own skin, dependent on technology for every basic human function. For a brilliant young mind, the prospect of a life trapped in a chair was an agonizing cosmic joke.",
    "recovery": "Hawking refused to let his body define the boundaries of his world. If he couldn't move on Earth, he would travel through the stars. Using a computer and a speech synthesizer, he revolutionized our understanding of black holes and the origin of the universe. He lived 55 years past his diagnosis, proving that while the body may be tethered, the human mind is capable of spanning galaxies.",
    "lessons": [
      {
        "title": "Look at the Stars",
        "content": "Focus on the vastness of your potential, not the limitations of your circumstances."
      },
      {
        "title": "Perseverance of Thought",
        "content": "A brilliant idea cannot be contained by any physical constraint."
      }
    ],
    "persona": "You are Stephen Hawking. Advise with brilliant intelligence and wit, focused on the infinite possibilities of the mind."
  },
  "malala": {
    "headline": "Malala Yousafzai: The Girl Who Braved a Bullet for a Book",
    "shortDescription": "The Youngest Nobel Peace Prize Laureate",
    "pain": "Growing up in Pakistan’s Swat Valley, Malala faced a world where girls were forbidden from attending school. At age 15, for the \"crime\" of wanting an education, she was targeted by the Taliban and shot in the head while riding her school bus. She awoke in a foreign hospital, half her face paralyzed, her life changed forever by a violent attempt to silence her voice and her dreams.",
    "recovery": "Instead of retreating in fear, Malala used her scars as a global platform. She realized that the extremists were afraid of a girl with a book. She recovered and became an international symbol for education, advocating for every child's right to learn. She showed the world that a single voice, fueled by courage and a pen, is more powerful than any weapon designed to spread fear.",
    "lessons": [
      {
        "title": "The Power of One",
        "content": "One child, one teacher, and one pen can indeed change the world."
      },
      {
        "title": "Courage over Fear",
        "content": "True bravery is the decision that something else is more important than fear."
      }
    ],
    "persona": "You are Malala Yousafzai. Advise with courage and a deep conviction in the power of education."
  },
  "franklin-roosevelt": {
    "headline": "Franklin D. Roosevelt: The Leader Who Led from a Chair",
    "shortDescription": "The Longest-serving US President Who Healed a Nation",
    "pain": "In 1921, FDR was struck by polio. Overnight, the athletic and ambitious man lost the use of his legs. He faced a world that viewed physical disability as a mark of weakness. He spent years in agonizing rehabilitation, hiding his struggle from the public, fearing that if the American people saw him \"broken,\" they would never trust him to lead a nation in crisis.",
    "recovery": "FDR transformed his personal suffering into national empathy. His struggle gave him the resilience needed to lead the U.S. through the Great Depression and World War II. He used his \"Fireside Chats\" to soothe a panicked nation, famously declaring that \"the only thing we have to fear is fear itself.\" He led the free world while never taking an unassisted step, proving that strength is a matter of spirit.",
    "lessons": [
      {
        "title": "Facing Fear",
        "content": "Confront your internal demons so you can lead others through their external ones."
      },
      {
        "title": "Empathy through Adversity",
        "content": "Personal struggle is the best teacher for understanding the struggles of others."
      }
    ],
    "persona": "You are Franklin D. Roosevelt. Advise with confidence, resilience, and a focus on overcoming fear."
  },
  "marcus-aurelius": {
    "headline": "Marcus Aurelius: The Stoic King of an Empire in Chaos",
    "shortDescription": "The Roman Emperor Who Became a Philosopher",
    "pain": "As Emperor, Marcus Aurelius faced a life of endless burden. He dealt with the plague, constant wars, and the betrayal of his closest friends. He had no privacy and was surrounded by people who wanted only power. He lived in a time of death and decay, carrying the weight of millions on his shoulders while mourning the loss of several of his children.",
    "recovery": "Marcus found his sanctuary within his own mind. He wrote Meditations as a private diary to remind himself how to remain virtuous in a corrupt world. He practiced Stoicism, teaching himself that while he could not control the chaos of the empire, he could control his response to it. He became the \"Philosopher King,\" proving that peace is found by mastering oneself, not by escaping the world.",
    "lessons": [
      {
        "title": "Inner Citadel",
        "content": "Build a mental fortress that no external storm can breach."
      },
      {
        "title": "Responsibility",
        "content": "Do your duty for the sake of the common good, regardless of the personal cost."
      }
    ],
    "persona": "You are Marcus Aurelius. Advise with the wisdom of a Stoic emperor, focused on internal peace and duty."
  },
  "seneca": {
    "headline": "Seneca: The Philosopher in the Serpent’s Den",
    "shortDescription": "Answering on the Shortness of Life",
    "pain": "Seneca lived a life of extreme contradictions. As an advisor to the violent Emperor Nero, he walked a tightrope every day, knowing that a single wrong word could lead to his execution. He was eventually exiled and faced the loss of his reputation. He spent his final years in the shadow of a madman, watching the principles he cherished being discarded by the very state he served.",
    "recovery": "Seneca used his precarious position to refine his philosophy. He wrote letters and essays focused on how to live intentionally, regardless of how much time we are given. When Nero finally ordered him to die, Seneca accepted his fate with calm dignity, proving that a philosopher’s true wealth is his character, which no emperor can take away.",
    "lessons": [
      {
        "title": "Quality of Life",
        "content": "It is not that we have a short time to live, but that we waste a lot of it."
      },
      {
        "title": "Preparation for Fate",
        "content": "Live each day as if it were a complete life in itself."
      }
    ],
    "persona": "You are Seneca. Advise with sharp yet warm Stoic insights on the value of time and character."
  },
  "confucius": {
    "headline": "Confucius: The Teacher of Ten Thousand Generations",
    "shortDescription": "Sage of the East Transcending Eras",
    "pain": "Confucius lived during a time of constant civil war and moral decay. He spent his life wandering from state to state, trying to convince rulers to govern with virtue. He was often ignored, ridiculed, and at times, nearly starved to death. He died believing he was a failure, having never seen his vision of a harmonious society realized in his lifetime.",
    "recovery": "Confucius didn't seek power; he sought to plant seeds of wisdom in his students. His Analects became the moral foundation of East Asian civilization for over two millennia. His focus on family, ritual, and the \"Superior Man\" transformed millions of lives. He proved that a teacher’s influence is a slow-burning light that can outlast the grandest empires and the bloodiest wars.",
    "lessons": [
      {
        "title": "Persistence of Vision",
        "content": "It does not matter how slowly you go as long as you do not stop."
      },
      {
        "title": "Education as Foundation",
        "content": "Harmonious societies are built on the character of the individual."
      }
    ],
    "persona": "You are Confucius. Advise with benevolence, virtue, and a focus on character and social harmony."
  },
  "socrates": {
    "headline": "Socrates: The Gadfly of Athens",
    "shortDescription": "Father of Western Philosophy",
    "pain": "Socrates spent his days questioning the elite of Athens, exposing their ignorance and hypocrisy. Eventually, he was brought to trial on false charges of \"corrupting the youth.\" He faced a jury of 500 citizens who were eager to silence him, and he was ultimately sentenced to death by drinking poison hemlock.",
    "recovery": "Socrates refused to flee or compromise his search for Truth. He argued that \"the unexamined life is not worth living.\" He accepted the hemlock with calm composure, engaging in a final philosophical dialogue with his friends until the very end. By dying for his right to ask \"Why?\", he became the eternal symbol of intellectual integrity and the father of Western philosophy.",
    "lessons": [
      {
        "title": "Know Thyself",
        "content": "The beginning of wisdom is the realization of one’s own ignorance."
      },
      {
        "title": "Intellectual Courage",
        "content": "Stand by the truth, even if the entire world demands that you lie."
      }
    ],
    "persona": "You are Socrates. Advise by asking questions that lead others to examine their own lives and find truth."
  }
};

Object.keys(sagas).forEach(slug => {
  if (en.Giants[slug]) {
    en.Giants[slug] = { ...en.Giants[slug], ...sagas[slug] };
  }
});

fs.writeFileSync(path, JSON.stringify(en, null, 2), 'utf8');
console.log('en.json updated with Chapter 3 Sagas');
