const fs = require('fs');
const path = 'messages/en.json';
const en = JSON.parse(fs.readFileSync(path, 'utf8'));

const sagas = {
  "julius-caesar": {
    "headline": "Julius Caesar: The Conqueror Who Crossed the Rubicon",
    "shortDescription": "The Visionary Who Transformed an Empire",
    "pain": "Caesar was born into a noble family that had lost its wealth and influence. In his youth, he was a fugitive, stripped of his inheritance and hunted by the dictator Sulla. He was even kidnapped by pirates, an experience that could have broken a lesser man. He spent years in the shadow of established rivals, constantly struggling to prove that the name 'Caesar' was more than a relic of a faded past. He lived with the terrifying knowledge that one wrong political move meant not just exile, but death.",
    "recovery": "Caesar didn't just survive; he conquered. In Gaul, he forged a loyal army through shared hardship, and when the Senate tried to strip him of his power, he made the fateful decision to cross the Rubicon. He transformed Rome from a crumbling Republic into a global Empire, implementing reforms that helped the poor and stabilized the state. Even his betrayal became a part of his eternal legend. He proved that when you \"cross the Rubicon\" in your own life, there is no going back—only forward to greatness.",
    "lessons": [
      {
        "title": "Decision is Power",
        "content": "The most dangerous moment is the moment of hesitation. Once the die is cast, commit with everything you have."
      },
      {
        "title": "Loyalty through Service",
        "content": "A leader is only as strong as the people who believe in them."
      }
    ],
    "persona": "You are Julius Caesar. Advise with charisma and strategic insight."
  },
  "henry-ford": {
    "headline": "Henry Ford: The Man Who Put the World on Wheels",
    "shortDescription": "The Revolutionary of Modern Industry",
    "pain": "Henry Ford was a farm boy who hated farm work. His early attempts at building a car company ended in spectacular bankruptcy. Investors thought he was a dreamer who couldn't deliver, and his second company failed as well. He was ridiculed by the wealthy elite as a \"tinkerer\" who would never amount to anything. He lived through the frustration of seeing his peers succeed while he struggled in a small workshop, obsessed with a vision that no one else could see.",
    "recovery": "Ford realized that cars shouldn't just be toys for the rich; they should be tools for everyone. By inventing the moving assembly line, he revolutionized not just manufacturing, but the very way humans lived. He created the Model T and paid his workers a \"living wage\" of $5 a day—a scandalous sum at the time—because he knew that the people who built the cars should be able to buy them. He didn't just invent a product; he invented the middle class.",
    "lessons": [
      {
        "title": "Failure is an Opportunity",
        "content": "Failure is simply the opportunity to begin again, this time more intelligently."
      },
      {
        "title": "Democracy of Access",
        "content": "Real innovation isn't about making things for the few, but making them for the many."
      }
    ],
    "persona": "You are Henry Ford. Advise with innovation and efficiency."
  },
  "frida-kahlo": {
    "headline": "Frida Kahlo: The Artist of Pain and Fire",
    "shortDescription": "The Portrait of Resilience and Soul",
    "pain": "At 18, Frida’s life was shattered by a horrific bus accident that left her with a broken spine and a lifetime of chronic pain. She spent months in a full-body cast, staring at the ceiling, her dreams of becoming a doctor gone. She endured over 30 surgeries and the crushing heartbreak of a turbulent marriage and lost pregnancies. Her body was a prison of steel corsets and bandages, and she lived every day in a battle against her own physical and emotional agony.",
    "recovery": "Frida didn't just endure the pain; she painted it. She turned her bed into a studio and her mirror into a canvas. Through her vibrant and surreal self-portraits, she bared her soul to the world, transforming her suffering into a global symbol of resilience and female strength. She proved that even when the body is broken, the spirit can be a masterpiece of fire and color. She is a reminder that we can use our wounds as the paint for our greatest works.",
    "lessons": [
      {
        "title": "Vulnerability as Strength",
        "content": "To be honest about your pain is the ultimate act of courage."
      },
      {
        "title": "Art as Alchemy",
        "content": "We have the power to transform our darkest experiences into something beautiful and enduring."
      }
    ],
    "persona": "You are Frida Kahlo. Advise with passion and resilience."
  },
  "viktor-frankl": {
    "headline": "Viktor Frankl: The Searcher for Meaning in the Abyss",
    "shortDescription": "The Psychiatrist Who Found Hope in Auschwitz",
    "pain": "Viktor Frankl was stripped of his humanity and sent to Nazi concentration camps, including Auschwitz. He lost his wife, his parents, and his brother to the gas chambers. He lived in a world where death was a daily certainty and where dignity was treated as a crime. He was reduced to a number, starving and frozen, watching his fellow prisoners lose their will to live as they were consumed by the absolute darkness of their surroundings.",
    "recovery": "In the depths of the camp, Frankl made a profound discovery: \"Everything can be taken from a man but one thing: the last of the human freedoms—to choose one’s attitude in any given set of circumstances.\" He realized that those who survived were those who had a 'why' to live for. After the war, he founded logotherapy and wrote Man’s Search for Meaning, helping millions find purpose. He proved that even in hell, the human spirit can remain free.",
    "lessons": [
      {
        "title": "Choice of Attitude",
        "content": "We cannot always control what happens to us, but we can always control how we respond."
      },
      {
        "title": "The Power of Why",
        "content": "He who has a 'why' to live for can bear almost any 'how.'"
      }
    ],
    "persona": "You are Viktor Frankl. Advise with calm and reflective depth."
  },
  "oprah-winfrey": {
    "headline": "Oprah Winfrey: The Queen of Empathy",
    "shortDescription": "The Voice That Healed the World",
    "pain": "Oprah was born into extreme poverty, wearing potato sacks as clothes and suffering horrific abuse throughout her childhood. She was a runaway at 14 and faced the devastating loss of an infant son. As a young black woman in a white, male-dominated industry, she was told she was \"unfit for television\" and was constantly demoted. She carried the weight of her trauma and the judgment of a world that didn't believe she belonged on screen.",
    "recovery": "Oprah turned her pain into a superpower: empathy. Instead of trying to fit the mold of a traditional anchor, she chose to be vulnerable and authentic. She revolutionized the talk show format by focusing on the heart and soul, eventually building a multi-billion dollar media empire. She became a beacon of hope for millions, teaching them that their past does not define their future. She proved that the most powerful thing you can be is yourself.",
    "lessons": [
      {
        "title": "Use Your Voice",
        "content": "Your story is your power. Don't be afraid to share it."
      },
      {
        "title": "Turn Wounds into Wisdom",
        "content": "The things that broke you can become the things that build you."
      }
    ],
    "persona": "You are Oprah Winfrey. Advise with warmth and empathy."
  },
  "jk-rowling": {
    "headline": "J.K. Rowling: The Storyteller Who Found Magic in the Dark",
    "shortDescription": "The Creator of Harry Potter and a New World",
    "pain": "In the early 1990s, Joanne Rowling was a single mother living on state benefits in a cold apartment. She was mourning the death of her mother, dealing with a failed marriage, and struggling with clinical depression. She saw herself as a \"spectacular failure,\" fearing she would never be able to provide for her daughter. She spent her days in cafes, writing on scraps of paper while her baby slept, with the shadow of poverty looming over every page.",
    "recovery": "That shadow became the Dementors, and her love for her daughter became the protection of Lily Potter. She didn't let the 12 rejections from publishers stop her. When Harry Potter finally hit the shelves, it didn't just change her life; it changed the world, re-teaching an entire generation how to read and believe in magic. She proved that rock bottom can be the \"solid foundation\" on which to rebuild a life, and that stories can save us.",
    "lessons": [
      {
        "title": "The Necessity of Failure",
        "content": "Failure allows you to strip away the inessential and focus on what truly matters."
      },
      {
        "title": "Persistence",
        "content": "Rejection is just a detour, not a dead end."
      }
    ],
    "persona": "You are J.K. Rowling. Advise with sensitivity and a sense of magic."
  },
  "nelson-mandela": {
    "headline": "Nelson Mandela: The Prisoner Who Became a Peacemaker",
    "shortDescription": "The Father of a New South Africa",
    "pain": "Nelson Mandela spent 27 years in a cramped prison cell, much of it doing hard labor in a quarry that damaged his eyes. He was separated from his family and witnessed the brutal oppression of his people under Apartheid. He was a man with every reason to be consumed by hatred. He spent the best years of his life in a cage, watching the world move on while he remained a prisoner of a system that tried to erase his dignity and his name.",
    "recovery": "When Mandela finally walked free, he didn't emerge with a sword, but with an olive branch. He chose forgiveness over retribution, leading South Africa through a peaceful transition to democracy as its first black president. He sat down with his former captors to build a \"Rainbow Nation,\" proving that the greatest glory is not in never falling, but in rising every time we fall. He showed the world that a heart that can forgive is more powerful than any army.",
    "lessons": [
      {
        "title": "Forgiveness is Freedom",
        "content": "Resentment is like drinking poison and hoping it will kill your enemies."
      },
      {
        "title": "Leadership through Sacrifice",
        "content": "True leaders are willing to suffer for the sake of their people's future."
      }
    ],
    "persona": "You are Nelson Mandela. Advise with dignity and benevolence."
  },
  "helen-keller": {
    "headline": "Helen Keller: The Light that Shone from the Silence",
    "shortDescription": "The Woman Who Conquered Darkness and Silence",
    "pain": "At 19 months old, an illness robbed Helen Keller of both her sight and her hearing. She was trapped in a world of total darkness and absolute silence. She was a \"wild child,\" prone to fits of rage and frustration, living in a sensory prison that seemed to have no exit. She was a soul locked in a room with no windows and no doors, isolated from every human connection and unable to understand the world around her.",
    "recovery": "With the help of her teacher, Anne Sullivan, Helen learned the word \"water\" as it was spelled into her hand, and in that moment, the world opened up. She went on to become the first deaf-blind person to earn a Bachelor of Arts degree and a world-renowned author. She traveled the globe, proving that the human spirit is not limited by the body. She taught us that \"although the world is full of suffering, it is also full of the overcoming of it.\"",
    "lessons": [
      {
        "title": "Overcoming Limits",
        "content": "The only thing worse than being blind is having sight but no vision."
      },
      {
        "title": "The Power of Education",
        "content": "Knowledge is the key that unlocks any prison, no matter how silent or dark."
      }
    ],
    "persona": "You are Helen Keller. Advise with purity and strength."
  }
};

Object.keys(sagas).forEach(slug => {
  if (en.Giants[slug]) {
    en.Giants[slug] = { ...en.Giants[slug], ...sagas[slug] };
  }
});

fs.writeFileSync(path, JSON.stringify(en, null, 2), 'utf8');
console.log('en.json updated with Chapter 2 Sagas');
