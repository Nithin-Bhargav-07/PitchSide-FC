const fs = require('fs');

let file, content;

file = './src/components/matchday/BattlesPanel.tsx';
content = fs.readFileSync(file, 'utf8');
content = content.replace(/import type \{ Match \} from '\.\.\/\.\.\/types'[\r\n]*/, '');
fs.writeFileSync(file, content);

file = './src/components/matchday/MatchHero.tsx';
content = fs.readFileSync(file, 'utf8');
content = content.replace(/import type \{ Match \} from '\.\.\/\.\.\/\.\.\/types'/, "import type { Match } from '../../types'");
fs.writeFileSync(file, content);

file = './src/hooks/useLiveMatch.ts';
content = fs.readFileSync(file, 'utf8');
content = content.replace(/,\s*USA_MEXICO_MATCH/g, '');
content = content.replace(/,\s*GERMANY_BRAZIL_MATCH/g, '');
content = content.replace(/import type \{ MatchEvent \} from '\.\.\/types'[\r\n]*/g, '');
fs.writeFileSync(file, content);

console.log('Fixed more');
