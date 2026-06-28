export const formations = [
  {
    name: '4-3-3',
    shape: 'Four defenders, three midfielders, three forwards.',
    strengths: 'Excellent balance, width in attack, natural passing triangles, strong pressing capability.',
    weaknesses: 'Midfield can be outnumbered by central structures, wide areas vulnerable on counters.',
    positions: [
      { top: 90, left: 50, label: 'GK', role: 'Protects the goal and initiates build-up play.' },
      { top: 75, left: 20, label: 'LB', role: 'Provides defensive width and overlaps in attack.' }, 
      { top: 75, left: 40, label: 'LCB', role: 'Central defensive anchor, covers half-spaces.' }, 
      { top: 75, left: 60, label: 'RCB', role: 'Central defensive anchor, intercepts through balls.' }, 
      { top: 75, left: 80, label: 'RB', role: 'Provides defensive width and overlaps in attack.' },
      { top: 50, left: 30, label: 'LCM', role: 'Box-to-box presence, supports left wing.' }, 
      { top: 55, left: 50, label: 'CDM', role: 'Protects the defense, dictates tempo.' }, 
      { top: 50, left: 70, label: 'RCM', role: 'Box-to-box presence, supports right wing.' },
      { top: 25, left: 20, label: 'LW', role: 'Cuts inside or crosses, stretches defense.' }, 
      { top: 20, left: 50, label: 'ST', role: 'Focal point of attack, pins center-backs.' }, 
      { top: 25, left: 80, label: 'RW', role: 'Cuts inside or crosses, stretches defense.' }
    ],
    pitchPositions: [{cx: 200, cy: 520}, {cx: 70, cy: 440}, {cx: 130, cy: 430}, {cx: 270, cy: 430}, {cx: 330, cy: 440}, {cx: 90, cy: 340}, {cx: 200, cy: 330}, {cx: 310, cy: 340}, {cx: 60, cy: 230}, {cx: 200, cy: 210}, {cx: 340, cy: 230}]
  },
  {
    name: '4-4-2',
    shape: 'Four defenders, four midfielders, two forwards.',
    strengths: 'Solid defensively with two banks of four, dual striker threat, easy to understand.',
    weaknesses: 'Often outnumbered in central midfield against a 3-man core, rigid lines.',
    positions: [
      { top: 90, left: 50, label: 'GK', role: 'Protects the goal and initiates build-up play.' },
      { top: 75, left: 20, label: 'LB', role: 'Maintains defensive line, supports wide attacks.' }, 
      { top: 75, left: 40, label: 'LCB', role: 'Clears crosses, marks opposing forwards.' }, 
      { top: 75, left: 60, label: 'RCB', role: 'Clears crosses, marks opposing forwards.' }, 
      { top: 75, left: 80, label: 'RB', role: 'Maintains defensive line, supports wide attacks.' },
      { top: 50, left: 20, label: 'LM', role: 'Provides width, tracks back defensively.' }, 
      { top: 50, left: 40, label: 'LCM', role: 'Controls the center, links defense and attack.' }, 
      { top: 50, left: 60, label: 'RCM', role: 'Controls the center, links defense and attack.' }, 
      { top: 50, left: 80, label: 'RM', role: 'Provides width, tracks back defensively.' },
      { top: 25, left: 35, label: 'LST', role: 'Combines with partner, attacks the box.' }, 
      { top: 25, left: 65, label: 'RST', role: 'Combines with partner, attacks the box.' }
    ],
    pitchPositions: [{cx: 200, cy: 520}, {cx: 70, cy: 440}, {cx: 140, cy: 430}, {cx: 260, cy: 430}, {cx: 330, cy: 440}, {cx: 60, cy: 330}, {cx: 160, cy: 340}, {cx: 240, cy: 340}, {cx: 340, cy: 330}, {cx: 150, cy: 220}, {cx: 250, cy: 220}]
  },
  {
    name: '4-2-3-1',
    shape: 'Four defenders, two defensive midfielders, three attacking midfielders, one striker.',
    strengths: 'Very solid core, versatile attacking options, flexible transition structure.',
    weaknesses: 'Lone striker can get isolated, demands high work rate from wide players.',
    positions: [
      { top: 90, left: 50, label: 'GK', role: 'Protects the goal and initiates build-up play.' },
      { top: 75, left: 20, label: 'LB', role: 'Provides defensive width and overlaps.' }, 
      { top: 75, left: 40, label: 'LCB', role: 'Central defensive anchor.' }, 
      { top: 75, left: 60, label: 'RCB', role: 'Central defensive anchor.' }, 
      { top: 75, left: 80, label: 'RB', role: 'Provides defensive width and overlaps.' },
      { top: 60, left: 35, label: 'LDM', role: 'Double pivot, breaks up play.' }, 
      { top: 60, left: 65, label: 'RDM', role: 'Double pivot, distributes from deep.' },
      { top: 40, left: 20, label: 'LAM', role: 'Inverted winger, creates chances.' }, 
      { top: 35, left: 50, label: 'CAM', role: 'Playmaker, links midfield to striker.' }, 
      { top: 40, left: 80, label: 'RAM', role: 'Inverted winger, creates chances.' },
      { top: 20, left: 50, label: 'ST', role: 'Target man or poacher, leads the line.' }
    ],
    pitchPositions: [{cx: 200, cy: 520}, {cx: 70, cy: 440}, {cx: 140, cy: 430}, {cx: 260, cy: 430}, {cx: 330, cy: 440}, {cx: 130, cy: 360}, {cx: 270, cy: 360}, {cx: 70, cy: 270}, {cx: 200, cy: 255}, {cx: 330, cy: 270}, {cx: 200, cy: 195}]
  },
  {
    name: '3-5-2',
    shape: 'Three centre-backs, two wing-backs, three central midfielders, two strikers.',
    strengths: 'Dominates central midfield, solid defensive base, excellent counter-attacking platform.',
    weaknesses: 'Vulnerable in wide areas behind wing-backs, demands immense stamina.',
    positions: [
      { top: 90, left: 50, label: 'GK', role: 'Protects the goal and sweeps behind defense.' },
      { top: 75, left: 25, label: 'LCB', role: 'Wide center-back, steps out to press.' }, 
      { top: 75, left: 50, label: 'CB', role: 'Central sweeper, organizes the line.' }, 
      { top: 75, left: 75, label: 'RCB', role: 'Wide center-back, steps out to press.' },
      { top: 55, left: 15, label: 'LWB', role: 'Provides total left flank coverage.' }, 
      { top: 50, left: 35, label: 'LCM', role: 'Box-to-box midfielder.' }, 
      { top: 55, left: 50, label: 'CDM', role: 'Holding midfielder, protects the back three.' }, 
      { top: 50, left: 65, label: 'RCM', role: 'Box-to-box midfielder.' }, 
      { top: 55, left: 85, label: 'RWB', role: 'Provides total right flank coverage.' },
      { top: 25, left: 35, label: 'LST', role: 'Runs the channels, combines.' }, 
      { top: 25, left: 65, label: 'RST', role: 'Runs the channels, combines.' }
    ],
    pitchPositions: [{cx: 200, cy: 520}, {cx: 100, cy: 430}, {cx: 200, cy: 420}, {cx: 300, cy: 430}, {cx: 40, cy: 340}, {cx: 120, cy: 320}, {cx: 200, cy: 310}, {cx: 280, cy: 320}, {cx: 360, cy: 340}, {cx: 140, cy: 210}, {cx: 260, cy: 210}]
  },
  {
    name: '5-3-2',
    shape: 'Five defenders, three midfielders, two strikers.',
    strengths: 'Extremely difficult to break down, forces opponents wide, strong central block.',
    weaknesses: 'Lacks attacking width, can become too deep and invite sustained pressure.',
    positions: [
      { top: 90, left: 50, label: 'GK', role: 'Protects the goal.' },
      { top: 75, left: 15, label: 'LWB', role: 'Defends wide areas, counters when possible.' }, 
      { top: 75, left: 30, label: 'LCB', role: 'Defends the box, blocks shots.' }, 
      { top: 75, left: 50, label: 'CB', role: 'Anchors the deep defense.' }, 
      { top: 75, left: 70, label: 'RCB', role: 'Defends the box, blocks shots.' }, 
      { top: 75, left: 85, label: 'RWB', role: 'Defends wide areas, counters when possible.' },
      { top: 55, left: 30, label: 'LCM', role: 'Shuttles side to side to close gaps.' }, 
      { top: 55, left: 50, label: 'CDM', role: 'Sits deep, intercepts passes.' }, 
      { top: 55, left: 70, label: 'RCM', role: 'Shuttles side to side to close gaps.' },
      { top: 25, left: 35, label: 'LST', role: 'Counter-attacking outlet.' }, 
      { top: 25, left: 65, label: 'RST', role: 'Counter-attacking outlet.' }
    ],
    pitchPositions: [{cx: 200, cy: 520}, {cx: 40, cy: 450}, {cx: 110, cy: 430}, {cx: 200, cy: 420}, {cx: 290, cy: 430}, {cx: 360, cy: 450}, {cx: 100, cy: 340}, {cx: 200, cy: 330}, {cx: 300, cy: 340}, {cx: 140, cy: 220}, {cx: 260, cy: 220}]
  },
  {
    name: '3-4-3',
    shape: 'Three defenders, four midfielders, three forwards.',
    strengths: 'Overloads wide areas, intense pressing capabilities, very aggressive structure.',
    weaknesses: 'Leaves spaces behind wide midfielders, requires highly mobile centre-backs.',
    positions: [
      { top: 90, left: 50, label: 'GK', role: 'Sweeper keeper, starts attacks.' },
      { top: 75, left: 25, label: 'LCB', role: 'Defends wide spaces on the left.' }, 
      { top: 75, left: 50, label: 'CB', role: 'Central organizer.' }, 
      { top: 75, left: 75, label: 'RCB', role: 'Defends wide spaces on the right.' },
      { top: 50, left: 20, label: 'LM', role: 'Wide midfielder, provides width.' }, 
      { top: 55, left: 40, label: 'LCM', role: 'Central pivot, dictates play.' }, 
      { top: 55, left: 60, label: 'RCM', role: 'Central pivot, dictates play.' }, 
      { top: 50, left: 80, label: 'RM', role: 'Wide midfielder, provides width.' },
      { top: 25, left: 25, label: 'LW', role: 'Inside forward, attacks the box.' }, 
      { top: 20, left: 50, label: 'ST', role: 'Central focal point.' }, 
      { top: 25, left: 75, label: 'RW', role: 'Inside forward, attacks the box.' }
    ],
    pitchPositions: [{cx: 200, cy: 520}, {cx: 100, cy: 430}, {cx: 200, cy: 420}, {cx: 300, cy: 430}, {cx: 50, cy: 330}, {cx: 160, cy: 340}, {cx: 240, cy: 340}, {cx: 350, cy: 330}, {cx: 70, cy: 230}, {cx: 200, cy: 210}, {cx: 330, cy: 230}]
  },
  {
    name: '4-1-4-1',
    shape: 'Four defenders, one pivot, four midfielders, one striker.',
    strengths: 'Very compact defensively, controls spaces between lines, excellent for possession.',
    weaknesses: 'Striker can easily become isolated, relies heavily on the single pivot.',
    positions: [
      { top: 90, left: 50, label: 'GK', role: 'Protects the goal.' },
      { top: 75, left: 20, label: 'LB', role: 'Defensive width.' }, 
      { top: 75, left: 40, label: 'LCB', role: 'Central defense.' }, 
      { top: 75, left: 60, label: 'RCB', role: 'Central defense.' }, 
      { top: 75, left: 80, label: 'RB', role: 'Defensive width.' },
      { top: 60, left: 50, label: 'CDM', role: 'Lone pivot, shields defense.' },
      { top: 40, left: 20, label: 'LM', role: 'Wide playmaker.' }, 
      { top: 40, left: 40, label: 'LCM', role: 'Advanced 8, pushes forward.' }, 
      { top: 40, left: 60, label: 'RCM', role: 'Advanced 8, pushes forward.' }, 
      { top: 40, left: 80, label: 'RM', role: 'Wide playmaker.' },
      { top: 20, left: 50, label: 'ST', role: 'Lone striker, holds up play.' }
    ],
    pitchPositions: [{cx: 200, cy: 520}, {cx: 70, cy: 440}, {cx: 140, cy: 430}, {cx: 260, cy: 430}, {cx: 330, cy: 440}, {cx: 200, cy: 380}, {cx: 60, cy: 310}, {cx: 140, cy: 300}, {cx: 260, cy: 300}, {cx: 340, cy: 310}, {cx: 200, cy: 200}]
  },
  {
    name: '4-2-2-2',
    shape: 'Four defenders, two defensive midfielders, two attacking midfielders, two strikers.',
    strengths: 'Central overloads, intense narrow pressing, dual striker dynamics.',
    weaknesses: 'Lacks natural width, completely dependent on full-backs for wide attacks.',
    positions: [
      { top: 90, left: 50, label: 'GK', role: 'Protects the goal.' },
      { top: 75, left: 20, label: 'LB', role: 'Sole provider of left width.' }, 
      { top: 75, left: 40, label: 'LCB', role: 'Central defense.' }, 
      { top: 75, left: 60, label: 'RCB', role: 'Central defense.' }, 
      { top: 75, left: 80, label: 'RB', role: 'Sole provider of right width.' },
      { top: 55, left: 35, label: 'LDM', role: 'Defensive pivot.' }, 
      { top: 55, left: 65, label: 'RDM', role: 'Defensive pivot.' },
      { top: 40, left: 30, label: 'LAM', role: 'Narrow playmaker, operates in half-space.' }, 
      { top: 40, left: 70, label: 'RAM', role: 'Narrow playmaker, operates in half-space.' },
      { top: 20, left: 35, label: 'LST', role: 'Striker, links with LAM.' }, 
      { top: 20, left: 65, label: 'RST', role: 'Striker, links with RAM.' }
    ],
    pitchPositions: [{cx: 200, cy: 520}, {cx: 70, cy: 440}, {cx: 140, cy: 430}, {cx: 260, cy: 430}, {cx: 330, cy: 440}, {cx: 130, cy: 350}, {cx: 270, cy: 350}, {cx: 90, cy: 270}, {cx: 310, cy: 270}, {cx: 150, cy: 190}, {cx: 250, cy: 190}]
  }
]
