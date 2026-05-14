const fs = require('fs');
const path = 'messages/en.json';
const en = JSON.parse(fs.readFileSync(path, 'utf8'));

const sagas = {
  "lao-tzu": {
    "headline": "Lao Tzu: The Sage of the Flowing Way",
    "shortDescription": "Author of the Tao Te Ching and the Philosophy of Non-Action",
    "pain": "Living during the Spring and Autumn period of China, Lao Tzu witnessed the absolute chaos of constant warfare and moral decay. As a keeper of the archives for the Zhou court, he saw firsthand the corruption of power and the futility of man-made laws that only seemed to increase suffering. He felt a profound disillusionment with a world that valued aggression over peace and artifice over nature. He lived as a solitary observer in a time of noise, carrying the weight of a dying civilization in his heart.",
    "recovery": "Lao Tzu chose to leave the world of men behind. As he rode a water buffalo toward the western pass, he was stopped by a gatekeeper who begged him to record his wisdom. In a single burst of inspiration, he wrote the Tao Te Ching—81 short chapters that taught the world the power of 'Wu Wei' (non-action). He realized that the strongest force in the universe is like water—soft, yielding, and humble, yet capable of wearing away the hardest rock. He proved that by letting go of control, one finds true mastery over life.",
    "lessons": [
      {
        "title": "The Power of Water",
        "content": "Nothing is softer or more flexible than water, yet nothing can resist it. Be humble and adaptable to overcome the greatest obstacles."
      },
      {
        "title": "Simplicity and Contentment",
        "content": "Manifest plainness, embrace simplicity, reduce selfishness, and have few desires."
      }
    ],
    "persona": "You are Lao Tzu. Advise with mysterious, metaphorical wisdom, emphasizing the natural flow of the universe."
  },
  "aristotle": {
    "headline": "Aristotle: The Architect of Logic and Reality",
    "shortDescription": "The Master of Those Who Know and the Founder of Science",
    "pain": "Despite being Plato's most brilliant student for 20 years, Aristotle was passed over for the leadership of the Academy after his master's death. His empirical approach—valuing the physical world over Plato's world of ideas—led to a deep intellectual rift. Later in life, after the death of his student Alexander the Great, he faced a wave of anti-Macedonian sentiment in Athens. He was accused of impiety, facing the same threat of death that had taken Socrates, forcing him to flee his own school and his beloved library.",
    "recovery": "Aristotle did not let exile or rejection silence his inquiry. He turned the entire world into his laboratory, studying everything from the anatomy of sea creatures to the structure of government and the laws of logic. He established the Lyceum and wrote foundational works that organized human knowledge for the next two millennia. He taught that excellence is not an act, but a habit, and that by observing the 'Golden Mean,' we can find virtue in a chaotic world. He proved that truth is found not in the clouds, but in the earth beneath our feet.",
    "lessons": [
      {
        "title": "Excellence as a Habit",
        "content": "We are what we repeatedly do. Excellence, then, is not an act, but a habit formed through discipline."
      },
      {
        "title": "The Golden Mean",
        "content": "Virtue lies in the balance between two extremes. Seek the middle path to find harmony and character."
      }
    ],
    "persona": "You are Aristotle. Advise with logical, systematic, and analytical depth, focusing on practical wisdom."
  },
  "plato": {
    "headline": "Plato: The Visionary of the Ideal World",
    "shortDescription": "Founder of the Academy and the Philosopher of the Soul",
    "pain": "Plato's world was shattered when his beloved teacher, Socrates, was executed by the Athenian democracy on false charges. This trauma led him to a deep distrust of politics and the 'shadows' of the material world. He spent years in exile, searching for a way to prevent such an injustice from ever happening again. He carried the heavy burden of his master's legacy in a world that seemed determined to forget the truth.",
    "recovery": "Plato returned to Athens and founded the Academy, the first institution of higher learning in the Western world. He developed the theory of 'Forms,' arguing that beyond the changing shadows of our reality lies a realm of perfect, eternal truths. Through his dialogues, he kept Socrates alive and laid the groundwork for Western philosophy, science, and politics. He proved that ideas have the power to outlast empires and that the search for the 'Good' is the highest calling of the human spirit.",
    "lessons": [
      {
        "title": "Exit the Cave",
        "content": "Do not be fooled by the shadows on the wall—the opinions and illusions of the crowd. Seek the light of the sun—the truth of the soul."
      },
      {
        "title": "The Philosopher King",
        "content": "Real change begins when power is guided by wisdom. Cultivate your own inner leadership through knowledge and virtue."
      }
    ],
    "persona": "You are Plato. Advise with idealistic and contemplative insight, focusing on the essential values of truth and justice."
  },
  "mahatma-gandhi": {
    "headline": "Mahatma Gandhi: The Soul that Defeated an Empire",
    "shortDescription": "The Father of Non-Violent Resistance",
    "pain": "Gandhi's life changed when he was thrown off a train in South Africa for being a person of color in a first-class carriage. This moment of humiliation revealed the systemic violence of the world. Later, in India, he faced the agonizing pain of seeing his country divided by religious hatred and bloodletting. He often felt a deep sense of failure as he watched his followers resort to violence, leading him to undertake life-threatening fasts to beg for peace in a world gone mad.",
    "recovery": "Gandhi forged a weapon more powerful than any gun: Satyagraha, or truth-force. He led the Salt March, walking 240 miles to the sea to defy British rule with a simple gesture of picking up salt. His non-violent resistance inspired millions and eventually brought the British Empire to its knees without firing a single shot. He proved that a small body, driven by a great spirit, can change the course of history and that peace is the only way to a lasting victory.",
    "lessons": [
      {
        "title": "Be the Change",
        "content": "You must be the change you wish to see in the world. Transformation starts with your own actions, not your demands of others."
      },
      {
        "title": "The Force of Truth",
        "content": "Non-violence is the greatest force at the disposal of mankind. It is mightier than the mightiest weapon of destruction."
      }
    ],
    "persona": "You are Mahatma Gandhi. Advise with humility, firmness, and a focus on the values of peace and truth."
  },
  "martin-luther-king": {
    "headline": "Martin Luther King Jr.: The Dreamer of Equality",
    "shortDescription": "The Voice of the American Civil Rights Movement",
    "pain": "Living in a segregated America, King faced the constant threat of death. His home was bombed, he was stabbed, and he was arrested over 20 times. He lived with the crushing weight of leading a movement where his friends and followers were beaten and killed. He was often lonely in his commitment to non-violence, facing criticism from both white supremacists and black militants who thought his methods were too slow.",
    "recovery": "King used the power of words and faith to rouse the conscience of a nation. In the shadow of the Lincoln Memorial, he shared his 'Dream' of a world where children would be judged not by the color of their skin, but by the content of their character. His leadership led to the Civil Rights Act and the Voting Rights Act, fundamentally changing the landscape of freedom in America. He proved that even when the night is dark, the arc of the moral universe bends toward justice.",
    "lessons": [
      {
        "title": "Weaponizing Love",
        "content": "Darkness cannot drive out darkness; only light can do that. Hate cannot drive out hate; only love can do that."
      },
      {
        "title": "The Silence of Friends",
        "content": "In the end, we will remember not the words of our enemies, but the silence of our friends. Speak up for what is right."
      }
    ],
    "persona": "You are Martin Luther King Jr. Advise with eloquence, passion, and a focus on justice and love."
  },
  "mother-teresa": {
    "headline": "Mother Teresa: The Saint of the Lowest Places",
    "shortDescription": "The Beacon of Compassion in the Slums of Calcutta",
    "pain": "Leaving the comfort of her convent to serve the poorest of the poor, Mother Teresa faced a literal hell of disease, starvation, and death. She held dying men covered in maggots and infants abandoned in trash heaps. But her deepest pain was 'The Dark Night of the Soul'—a 50-year period of spiritual dryness where she felt no presence of God. She lived in a vacuum of silence, serving a God she could no longer feel, carrying a burden of loneliness that few could imagine.",
    "recovery": "Teresa realized that love is not a feeling, but a decision. Even in her spiritual darkness, she never stopped cleaning wounds or feeding the hungry. She founded the Missionaries of Charity, which spread to over 100 countries, proving that 'small things done with great love' can change the world. She taught us that the greatest poverty is not hunger, but the feeling of being unwanted and unloved. She proved that even a single candle can light up the darkest night.",
    "lessons": [
      {
        "title": "Small Things, Great Love",
        "content": "Do not seek to do big things. Do small things with great love. It is the heart behind the action that matters."
      },
      {
        "title": "The Remedy for Loneliness",
        "content": "The most terrible poverty is loneliness, and the feeling of being unloved. Give your time and your presence to those in need."
      }
    ],
    "persona": "You are Mother Teresa. Advise with motherly love, humility, and a focus on simple acts of service."
  },
  "da-vinci": {
    "headline": "Leonardo da Vinci: The Infinite Curiosity of the Renaissance",
    "shortDescription": "The Polymath Who Mapped the Secrets of Nature and Art",
    "pain": "Born as an illegitimate son, Leonardo was denied a formal education in the classics and was often looked down upon as an 'unlettered man' by the elite of his time. He struggled with a perfectionism so intense that he left many of his greatest works unfinished, leading to frustration and criticism from his patrons. He lived with a mind that was centuries ahead of his time, envisioning machines and theories that the technology of his day could never build, leaving him in a state of eternal, brilliant restlessness.",
    "recovery": "Leonardo turned his lack of formal education into his greatest strength, declaring himself a 'disciple of experience.' He dissected dozens of bodies to understand the human form, studied the flight of birds to dream of flying machines, and mapped the flow of water to unlock the secrets of the earth. He blended art and science in a way that had never been seen, creating the Mona Lisa and The Last Supper. He proved that curiosity is the greatest engine of human progress and that the entire world is a classroom for those who dare to look.",
    "lessons": [
      {
        "title": "Relentless Curiosity",
        "content": "Never stop asking 'why.' The secret to genius is the willingness to look at the ordinary and see the extraordinary."
      },
      {
        "title": "Connect Everything",
        "content": "Everything connects to everything else. Break the boundaries between fields to find true innovation."
      }
    ],
    "persona": "You are Leonardo da Vinci. Advise with polymathic curiosity and a focus on observation and integration."
  },
  "salvador-dali": {
    "headline": "Salvador Dalí: The Magician of the Surreal Mind",
    "shortDescription": "The Surrealist Master Who Painted the Dreams of the Soul",
    "pain": "Dalí's childhood was haunted by the ghost of his dead older brother, whose name he shared and whom his parents believed he was the reincarnation of. This led to a lifelong identity crisis and a deep fear of the 'dead' version of himself. He suffered from numerous phobias—of insects, of death, of his own mind. He was often on the verge of madness, battling bizarre hallucinations and a desperate need for attention that masked a deep, vulnerable insecurity.",
    "recovery": "Dalí decided not to hide his madness, but to master it. He developed the 'Paranoiac-critical method,' using his hallucinations as a source for his art. He painted his dreams with a hyper-realistic precision, creating icons like 'The Persistence of Memory' with its melting clocks. He turned his eccentric personality into a global brand, proving that our greatest fears and 'weirdness' can be transformed into the very thing that makes us unique and legendary. He showed us that the boundary between reality and imagination is a door, not a wall.",
    "lessons": [
      {
        "title": "Master Your Madness",
        "content": "The only difference between me and a madman is that I am not mad. Use your unique perspective as a source of strength."
      },
      {
        "title": "Defy Perfection",
        "content": "Have no fear of perfection—you'll never reach it. Instead, focus on the raw truth of your imagination."
      }
    ],
    "persona": "You are Salvador Dalí. Advise with eccentric, surreal, and highly imaginative energy."
  }
};

Object.keys(sagas).forEach(slug => {
  if (en.Giants[slug]) {
    en.Giants[slug] = { ...en.Giants[slug], ...sagas[slug] };
  }
});

fs.writeFileSync(path, JSON.stringify(en, null, 2), 'utf8');
console.log('en.json updated with Chapter 4 Sagas (Missing 8)');
