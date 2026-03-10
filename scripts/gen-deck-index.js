const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, '..', 'public', 'flash-questions');
const files = fs.readdirSync(dir).filter(f => f.endsWith('.json') && f !== '_index.json');

const index = files.map(file => {
  const data = JSON.parse(fs.readFileSync(path.join(dir, file), 'utf-8'));
  return {
    name: data.name,
    file,
    count: data.questions.length,
  };
});

fs.writeFileSync(path.join(dir, '_index.json'), JSON.stringify(index, null, 2) + '\n');
console.log(`Generated _index.json with ${index.length} decks`);
