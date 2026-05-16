
import { questions } from './src/data/heritage-test';

const pillarKeys = {
  Scope: ['L', 'S'],
  Drive: ['R', 'P'],
  Method: ['D', 'H'],
  Origin: ['I', 'T']
};

questions.forEach((q, index) => {
  const allowed = pillarKeys[q.pillar];
  if (!allowed) {
    console.error(`Question ${index + 1} (ID: ${q.id}) has invalid pillar: ${q.pillar}`);
    return;
  }
  ['A', 'B', 'C', 'D'].forEach(opt => {
    const val = q.options[opt].value;
    if (!allowed.includes(val)) {
      console.error(`Question ${index + 1} (ID: ${q.id}) Option ${opt} has invalid value ${val} for pillar ${q.pillar}`);
    }
  });
});

console.log("Validation complete.");
