export const TEAM_TACTICS: Record<string, {
  style: string;
  keyPoints: { text: string; icon: string }[];
  strengths: string;
  weakness: string;
}> = {
  'FRA': {
    style: 'Defensive counter-attack',
    keyPoints: [
      { text: 'Mbappé runs in behind', icon: 'Zap' },
      { text: 'Tchouaméni screens the back 4', icon: 'Shield' },
      { text: 'Griezmann drops between lines to link play', icon: 'ArrowLeftRight' }
    ],
    strengths: 'Devastating on the break, world-class GK.',
    weakness: 'Can be passive without the ball for long periods.'
  },
  'CRO': {
    style: 'Possession + midfield control',
    keyPoints: [
      { text: 'Modrić dictates tempo from deep', icon: 'Activity' },
      { text: 'Gvardiol overlaps aggressively', icon: 'ArrowLeftRight' },
      { text: 'Brozović breaks up opposition play', icon: 'Shield' }
    ],
    strengths: 'Elite at recycling possession, experienced.',
    weakness: 'Lack of a clinical striker, slow to transition.'
  },
  'POR': {
    style: 'Structured attack through wide areas',
    keyPoints: [
      { text: 'Bernardo and Leão combine on the left', icon: 'ArrowLeftRight' },
      { text: 'Ronaldo positions for crosses', icon: 'Target' },
      { text: 'Palhinha sits deepest to protect', icon: 'Lock' }
    ],
    strengths: 'Width, delivery into the box, set pieces.',
    weakness: 'Defensive shape breaks down on fast counters.'
  },
  'ENG': {
    style: 'High press, quick verticality',
    keyPoints: [
      { text: 'Bellingham arrives late into the box', icon: 'Zap' },
      { text: 'Saka cuts inside from the right', icon: 'Crosshair' },
      { text: 'Rice protects the defense', icon: 'Shield' }
    ],
    strengths: 'Physical intensity, set piece threat.',
    weakness: 'Can struggle against deep defensive blocks.'
  },
  'SPA': {
    style: 'Positional play, high press',
    keyPoints: [
      { text: 'Pedri and Yamal combine through tight spaces', icon: 'Activity' },
      { text: 'Rodri controls tempo from deep', icon: 'Lock' },
      { text: 'Morata makes runs in behind', icon: 'Target' }
    ],
    strengths: 'Ball retention, pressing triggers, youth energy.',
    weakness: 'Vulnerable to pace in behind when pressing high.'
  },
  'ARG': {
    style: 'Messi-centric fluid attack',
    keyPoints: [
      { text: 'Messi drops deep to receive', icon: 'Activity' },
      { text: 'Di María stretches wide', icon: 'ArrowLeftRight' },
      { text: 'De Paul covers ground to win back possession', icon: 'Shield' }
    ],
    strengths: 'Individual brilliance, resilience, experience.',
    weakness: 'Aging midfield legs in a long tournament.'
  },
  'BRA': {
    style: 'Direct, pace-driven attack',
    keyPoints: [
      { text: 'Vinicius Jr one-on-one on the left', icon: 'Zap' },
      { text: 'Rodrygo combines centrally', icon: 'Activity' },
      { text: 'Paquetá carries from midfield', icon: 'ArrowLeftRight' }
    ],
    strengths: 'Explosive wide players, physical midfield.',
    weakness: 'Set piece vulnerability, Casemiro\'s fitness.'
  },
  'GER': {
    style: 'Structured build-up, fluid attacking third',
    keyPoints: [
      { text: 'Kimmich inverts from right-back', icon: 'ArrowLeftRight' },
      { text: 'Musiala drifts between lines', icon: 'Activity' },
      { text: 'Müller finds pockets of space', icon: 'Target' }
    ],
    strengths: 'Tactical flexibility, technical quality.',
    weakness: 'Vulnerable to fast transitions on the counter.'
  },
  'MOR': {
    style: 'Low block, lethal on set pieces',
    keyPoints: [
      { text: 'Amrabat disrupts in midfield', icon: 'Shield' },
      { text: 'Hakimi bombs forward from right-back', icon: 'Zap' },
      { text: 'Ziyech delivers crosses and free kicks', icon: 'Crosshair' }
    ],
    strengths: 'Defensive organization, aerial threat.',
    weakness: 'Limited when required to chase a match.'
  }
}

export const getTeamTactics = (teamTLA: string) => {
  return TEAM_TACTICS[teamTLA] || null
}
