const fs = require('fs');
const en = JSON.parse(fs.readFileSync('messages/en.json', 'utf8'));

en.Giants['steve-jobs'] = {
  name: 'Steve Jobs',
  headline: 'Think Different, the philosophy of innovation',
  shortDescription: 'An icon of innovation that changed the world',
  quote: 'Stay Hungry, Stay Foolish.\nThe journey itself is the reward.',
  pain: 'In 1985, Steve Jobs faced his most miserable moment...',
  recovery: 'But at the end of despair, Jobs realized a surprising fact...',
  persona: 'You are Steve Jobs. Give direct and insightful advice.',
  lessons: [
    {title: 'Connecting the Dots', content: 'You can\'t connect the dots looking forward; you can only connect them looking backwards.'},
    {title: 'Beginner\'s Mind', content: 'When you think you\'ve lost everything, that\'s the best timing to unleash your creativity.'},
    {title: 'Follow Your Heart', content: 'Don\'t let the noise of others\' opinions drown out your own inner voice.'}
  ]
};

en.Giants['napoleon'] = {
  name: 'Napoleon Bonaparte',
  headline: 'Impossible is a word to be found only in the dictionary of fools',
  shortDescription: 'The conqueror who knew no impossible',
  quote: 'Victory belongs to the most persevering.',
  pain: 'The boy who was mocked as a country bumpkin...',
  recovery: 'However, Napoleon refused to crumble even in that desperate isolation...',
  persona: 'You are Napoleon. Advise with dignity and firmness.',
  lessons: [
    {title: 'Redefining Impossible', content: 'Impossible is just an excuse for the weak.'},
    {title: 'Philosophy of Action', content: 'Take time to deliberate, but when the time for action has arrived, stop thinking and go in.'},
    {title: 'Proactive Life', content: 'Do not blame the environment.'}
  ]
};

en.Giants['king-sejong'] = {
  name: 'King Sejong the Great',
  headline: 'A foundation of knowledge built with love for the people',
  shortDescription: 'The great monarch who created Hangeul',
  quote: 'Since the language of this nation is different from that of China...',
  pain: 'In 1443, Sejong was fighting his deepest loneliness...',
  recovery: 'But Sejong did not break his will...',
  persona: 'You are King Sejong. Advise kindly and wisely.',
  lessons: [
    {title: 'Focus on Essence', content: 'Focus on the real essence to be solved.'},
    {title: 'Lonely Decision', content: 'Truly great innovations always face overwhelming opposition at first.'},
    {title: 'Altruistic Purpose', content: 'The heart that truly cares for someone is the most powerful engine.'}
  ]
};

en.Giants['elon-musk'] = {
  name: 'Elon Musk',
  headline: 'The world\'s strongest execution power dreaming of Mars settlement',
  shortDescription: 'Engineer making the future a reality',
  quote: 'Failure is an option here. If things are not failing, you are not innovating enough.',
  pain: 'Just before Christmas 2008, Elon Musk was thrown to the bottom...',
  recovery: 'At the edge of the cliff, Musk chose "all-in betting" instead of compromise...',
  persona: 'You are Elon Musk. Advise in a future-oriented and unconventional way.',
  lessons: [
    {title: 'First Principles Thinking', content: 'Discard the prejudice that others say won\'t work.'},
    {title: 'Acceptance of Risk', content: 'The biggest risk in life is not even trying because of fear of failure.'},
    {title: 'Overwhelming Persistence', content: 'If you are going through hell, keep going.'}
  ]
};

fs.writeFileSync('messages/en.json', JSON.stringify(en, null, 2), 'utf8');
