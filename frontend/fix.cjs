const fs = require('fs');
const path = require('path');

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    file = path.resolve(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) {
      results = results.concat(walk(file));
    } else if (file.endsWith('.ts') || file.endsWith('.tsx')) {
      results.push(file);
    }
  });
  return results;
}

const files = walk(__dirname + '/src');

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  
  // Fix type imports
  content = content.replace(/import\s+\{([^}]+)\}\s+from\s+['"]([^'"]*types[^'"]*)['"]/g, "import type { $1 } from '$2'");
  
  // Fix BattlesPanel
  if (file.endsWith('BattlesPanel.tsx')) {
    content = content.replace(/\{ match \}: \{ match: Match \}/g, '');
    content = content.replace(/import type \{ Match \} from '\.\.\/\.\.\/types'\n/g, '');
  }

  // Fix Matchday BattlesPanel usage
  if (file.endsWith('Matchday.tsx')) {
    content = content.replace(/<BattlesPanel match=\{selectedMatch\} \/>/g, '<BattlesPanel />');
  }

  // Fix MatchHero
  if (file.endsWith('MatchHero.tsx')) {
    content = content.replace(/import type \{ Match \} from '\.\.\/\.\.\/\.\.\/types'/g, "import type { Match } from '../../types'");
    content = content.replace(/const isBrazil = match\.homeTeam\.tla === 'BRA' \|\| match\.awayTeam\.tla === 'BRA'\s*/g, '');
  }

  // Fix StandingsPanel
  if (file.endsWith('StandingsPanel.tsx')) {
    content = content.replace(/import \{ useState, useEffect \} from 'react'\n/g, '');
  }

  // Fix WhatIfSimulator
  if (file.endsWith('WhatIfSimulator.tsx')) {
    content = content.replace(/import \{ Skeleton \} from '\.\.\/shared\/Skeleton'\n/g, '');
  }

  // Fix TacticsPanel
  if (file.endsWith('TacticsPanel.tsx')) {
    content = content.replace(/ArrowsLeftRight/g, 'ArrowLeftRight');
  }

  // Fix useLiveMatch
  if (file.endsWith('useLiveMatch.ts')) {
    content = content.replace(/import type \{ MatchEvent \} from '\.\.\/types'\n/g, '');
    content = content.replace(/const match = demoMatchKey === 'usa_mexico' \? USA_MEXICO_MATCH : GERMANY_BRAZIL_MATCH\s*/g, '');
  }

  // Fix InPlay
  if (file.endsWith('InPlay.tsx')) {
    content = content.replace(/import \{ useState, useEffect \} from 'react'/g, "import { useState } from 'react'");
  }

  fs.writeFileSync(file, content);
});

console.log('Fixed');
