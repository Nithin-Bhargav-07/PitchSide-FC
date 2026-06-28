const fs = require('fs');

let file, content;

file = './src/components/matchday/BattlesPanel.tsx';
content = fs.readFileSync(file, 'utf8');
content = content.replace(/import type \{\s*Match\s*\} from '\.\.\/\.\.\/types'[\r\n]*/, '');
fs.writeFileSync(file, content);

file = './src/components/matchday/MatchHero.tsx';
content = fs.readFileSync(file, 'utf8');
content = content.replace(/import type \{\s*Match\s*\} from '\.\.\/\.\.\/\.\.\/types'/, "import type { Match } from '../../types'");
fs.writeFileSync(file, content);

file = './src/hooks/useLiveMatch.ts';
content = fs.readFileSync(file, 'utf8');
content = content.replace(/import type \{\s*MatchEvent\s*\} from '\.\.\/types'[\r\n]*/, '');
fs.writeFileSync(file, content);
