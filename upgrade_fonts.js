const fs = require('fs');
const path = require('path');

const dir = '/Users/gadda/Downloads/PitchSideFC/frontend/src/components';

const walk = (d) => {
  const files = fs.readdirSync(d);
  for (const f of files) {
    const p = path.join(d, f);
    if (fs.statSync(p).isDirectory()) {
      walk(p);
    } else if (p.endsWith('.tsx') && !p.includes('Sidebar.tsx') && !p.includes('LineupPanel.tsx')) {
      let content = fs.readFileSync(p, 'utf-8');
      let original = content;

      // Body text upgrades:
      // Replace text-[12px] or text-[13px] or text-xs when accompanied by leading-relaxed
      content = content.replace(/(text-\[12px\]|text-\[13px\]|text-xs)(.*?)leading-relaxed/g, 'text-[14px]$2leading-relaxed');
      
      // StoryPanel descriptions (What's at stake)
      if (p.includes('StoryPanel.tsx')) {
        content = content.replace(/text-\[12px\] text-text-ai/g, 'text-[14px] text-text-ai');
      }

      // AskAnything descriptions
      if (p.includes('AskAnything.tsx')) {
        content = content.replace(/text-\[13px\] text-text-ai/g, 'text-[14px] text-text-ai');
        content = content.replace(/text-\[13px\] font-medium text-text-secondary/g, 'text-[14px] font-medium text-white'); // Player names? Wait, "Player names: text-white". Actually Q/A text should be white or secondary. 
        // Let's just fix the leading-relaxed one.
      }
      
      // BottomNav tab labels
      if (p.includes('BottomNav.tsx')) {
         content = content.replace(/text-\[12px\] font-medium/g, 'text-[14px] font-medium');
      }

      // LiveTacticsPanel body text
      if (p.includes('LiveTacticsPanel.tsx')) {
        content = content.replace(/text-\[12px\] text-text-ai/g, 'text-[14px] text-text-ai');
      }

      if (content !== original) {
        fs.writeFileSync(p, content);
      }
    }
  }
}
walk(dir);
