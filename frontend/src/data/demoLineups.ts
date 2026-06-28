export const DEMO_LINEUPS: Record<string, { formation: string; lineup: any[] }> = {
  'FRA': {
    formation: '4-3-3',
    lineup: [
      { number: 1, name: 'Maignan', position: 'GK' },
      { number: 2, name: 'Pavard', position: 'RB' },
      { number: 5, name: 'Konaté', position: 'CB' },
      { number: 4, name: 'Upamecano', position: 'CB' },
      { number: 22, name: 'T. Hernández', position: 'LB' },
      { number: 8, name: 'Tchouaméni', position: 'CM' },
      { number: 14, name: 'Rabiot', position: 'CM' },
      { number: 7, name: 'Griezmann', position: 'CM' },
      { number: 11, name: 'Dembélé', position: 'RW' },
      { number: 10, name: 'Mbappé', position: 'ST', isKey: true },
      { number: 9, name: 'Giroud', position: 'LW' },
    ]
  },
  'CRO': {
    formation: '4-2-3-1',
    lineup: [
      { number: 23, name: 'Livaković', position: 'GK' },
      { number: 2, name: 'Stanišić', position: 'RB' },
      { number: 6, name: 'Šutalo', position: 'CB' },
      { number: 21, name: 'Pongračić', position: 'CB' },
      { number: 3, name: 'Gvardiol', position: 'LB' },
      { number: 11, name: 'Brozović', position: 'CDM' },
      { number: 8, name: 'Kovačić', position: 'CDM' },
      { number: 10, name: 'Modrić', position: 'RAM', isKey: true },
      { number: 7, name: 'Vlašić', position: 'CAM' },
      { number: 17, name: 'Ivanušec', position: 'LAM' },
      { number: 9, name: 'Kramarić', position: 'ST' },
    ]
  },
  'POR': {
    formation: '4-2-3-1',
    lineup: [
      { number: 1, name: 'Costa', position: 'GK' },
      { number: 2, name: 'Dalot', position: 'RB' },
      { number: 4, name: 'Rúben Dias', position: 'CB' },
      { number: 6, name: 'A. Silva', position: 'CB' },
      { number: 5, name: 'Guerreiro', position: 'LB' },
      { number: 8, name: 'Palhinha', position: 'CDM' },
      { number: 16, name: 'Vitinha', position: 'CDM' },
      { number: 11, name: 'Bernardo', position: 'RAM' },
      { number: 10, name: 'B. Fernandes', position: 'CAM', isKey: true },
      { number: 17, name: 'Leão', position: 'LAM' },
      { number: 7, name: 'Ronaldo', position: 'ST', isKey: true },
    ]
  },
  'ENG': {
    formation: '4-3-3',
    lineup: [
      { number: 1, name: 'Pickford', position: 'GK' },
      { number: 2, name: 'Alexander-Arnold', position: 'RB' },
      { number: 5, name: 'Stones', position: 'CB' },
      { number: 6, name: 'Maguire', position: 'CB' },
      { number: 3, name: 'Trippier', position: 'LB' },
      { number: 4, name: 'Rice', position: 'CM' },
      { number: 8, name: 'Bellingham', position: 'CM', isKey: true },
      { number: 10, name: 'Saka', position: 'CM' },
      { number: 20, name: 'Palmer', position: 'RW' },
      { number: 9, name: 'Kane', position: 'ST', isKey: true },
      { number: 11, name: 'Foden', position: 'LW' },
    ]
  },
  'SPA': {
    formation: '4-3-3',
    lineup: [
      { number: 1, name: 'Unai Simón', position: 'GK' },
      { number: 2, name: 'Carvajal', position: 'RB' },
      { number: 24, name: 'Le Normand', position: 'CB' },
      { number: 14, name: 'Laporte', position: 'CB' },
      { number: 3, name: 'Gayà', position: 'LB' },
      { number: 5, name: 'Busquets', position: 'CM' },
      { number: 16, name: 'Rodri', position: 'CM' },
      { number: 8, name: 'Pedri', position: 'CM', isKey: true },
      { number: 11, name: 'Ferran Torres', position: 'RW' },
      { number: 7, name: 'Morata', position: 'ST' },
      { number: 22, name: 'Yamal', position: 'LW', isKey: true },
    ]
  },
  'ARG': {
    formation: '4-2-3-1',
    lineup: [
      { number: 23, name: 'E. Martínez', position: 'GK' },
      { number: 2, name: 'Montiel', position: 'RB' },
      { number: 13, name: 'Romero', position: 'CB' },
      { number: 6, name: 'L. Martínez', position: 'CB' },
      { number: 3, name: 'Tagliafico', position: 'LB' },
      { number: 5, name: 'Mac Allister', position: 'CDM' },
      { number: 7, name: 'De Paul', position: 'CDM' },
      { number: 11, name: 'Di María', position: 'RAM', isKey: true },
      { number: 20, name: 'E. Fernández', position: 'CAM' },
      { number: 15, name: 'Acuña', position: 'LAM' },
      { number: 10, name: 'Messi', position: 'ST', isKey: true },
    ]
  },
  'BRA': {
    formation: '4-3-3',
    lineup: [
      { number: 1, name: 'Alisson', position: 'GK' },
      { number: 2, name: 'Danilo', position: 'RB' },
      { number: 3, name: 'Marquinhos', position: 'CB' },
      { number: 4, name: 'G. Magalhães', position: 'CB' },
      { number: 6, name: 'Arana', position: 'LB' },
      { number: 5, name: 'Casemiro', position: 'CM' },
      { number: 8, name: 'Paquetá', position: 'CM', isKey: true },
      { number: 15, name: 'B. Guimarães', position: 'CM' },
      { number: 20, name: 'Rodrygo', position: 'RW' },
      { number: 9, name: 'Endrick', position: 'ST' },
      { number: 11, name: 'Vinicius Jr', position: 'LW', isKey: true },
    ]
  },
  'GER': {
    formation: '4-2-3-1',
    lineup: [
      { number: 1, name: 'Neuer', position: 'GK' },
      { number: 2, name: 'Kimmich', position: 'RB' },
      { number: 4, name: 'Rüdiger', position: 'CB' },
      { number: 5, name: 'Schlotterbeck', position: 'CB' },
      { number: 3, name: 'Raum', position: 'LB' },
      { number: 6, name: 'Goretzka', position: 'CDM' },
      { number: 8, name: 'Kroos', position: 'CDM', isKey: true },
      { number: 25, name: 'Müller', position: 'RAM' },
      { number: 10, name: 'Musiala', position: 'CAM', isKey: true },
      { number: 19, name: 'Gnabry', position: 'LAM' },
      { number: 9, name: 'Havertz', position: 'ST' },
    ]
  },
  'MOR': {
    formation: '4-3-3',
    lineup: [
      { number: 1, name: 'Bounou', position: 'GK' },
      { number: 2, name: 'Hakimi', position: 'RB', isKey: true },
      { number: 5, name: 'Saïss', position: 'CB' },
      { number: 6, name: 'Aguerd', position: 'CB' },
      { number: 3, name: 'Masina', position: 'LB' },
      { number: 4, name: 'Amrabat', position: 'CM' },
      { number: 8, name: 'Ounahi', position: 'CM' },
      { number: 7, name: 'Ziyech', position: 'CM', isKey: true },
      { number: 19, name: 'Boufal', position: 'RW' },
      { number: 9, name: 'En-Nesyri', position: 'ST' },
      { number: 11, name: 'Ez Abde', position: 'LW' },
    ]
  },
  'USA': {
    formation: '4-3-3',
    lineup: [
      { number: 1, name: 'Turner', position: 'GK' },
      { number: 2, name: 'Dest', position: 'RB' },
      { number: 5, name: 'Richards', position: 'CB' },
      { number: 4, name: 'Zimmerman', position: 'CB' },
      { number: 3, name: 'Robinson', position: 'LB' },
      { number: 6, name: 'Adams', position: 'CM', isKey: true },
      { number: 8, name: 'McKennie', position: 'CM' },
      { number: 10, name: 'Reyna', position: 'CM' },
      { number: 7, name: 'Weah', position: 'RW' },
      { number: 9, name: 'Ferreira', position: 'ST' },
      { number: 11, name: 'Pulisic', position: 'LW', isKey: true },
    ]
  },
  'MEX': {
    formation: '4-2-3-1',
    lineup: [
      { number: 13, name: 'Ochoa', position: 'GK' },
      { number: 2, name: 'Sánchez', position: 'RB' },
      { number: 3, name: 'Montes', position: 'CB' },
      { number: 15, name: 'Moreno', position: 'CB' },
      { number: 23, name: 'Gallardo', position: 'LB' },
      { number: 18, name: 'Herrera', position: 'CDM' },
      { number: 16, name: 'Álvarez', position: 'CDM' },
      { number: 22, name: 'Lozano', position: 'RAM', isKey: true },
      { number: 7, name: 'Corona', position: 'CAM' },
      { number: 11, name: 'Vega', position: 'LAM' },
      { number: 9, name: 'Jiménez', position: 'ST' },
    ]
  },
  'GHA': {
    formation: '4-2-3-1',
    lineup: [
      { number: 1, name: 'Ati-Zigi', position: 'GK' },
      { number: 2, name: 'Lamptey', position: 'RB' },
      { number: 5, name: 'Amartey', position: 'CB' },
      { number: 3, name: 'Salisu', position: 'CB' },
      { number: 18, name: 'Mensah', position: 'LB' },
      { number: 8, name: 'Partey', position: 'CDM', isKey: true },
      { number: 6, name: 'Samed', position: 'CDM' },
      { number: 11, name: 'Kudus', position: 'RAM', isKey: true },
      { number: 10, name: 'Ayew', position: 'CAM' },
      { number: 7, name: 'A. Ayew', position: 'LAM' },
      { number: 9, name: 'Afena-Gyan', position: 'ST' },
    ]
  },
  'PAN': {
    formation: '5-3-2',
    lineup: [
      { number: 1, name: 'Mosquera', position: 'GK' },
      { number: 2, name: 'Murillo', position: 'RWB' },
      { number: 4, name: 'Escobar', position: 'CB' },
      { number: 5, name: 'Miller', position: 'CB' },
      { number: 6, name: 'Córdoba', position: 'CB' },
      { number: 3, name: 'Davis', position: 'LWB' },
      { number: 8, name: 'Godoy', position: 'CM' },
      { number: 10, name: 'Fajardo', position: 'CM', isKey: true },
      { number: 7, name: 'Carrasquilla', position: 'CM' },
      { number: 9, name: 'Tejada', position: 'ST', isKey: true },
      { number: 11, name: 'Ávila', position: 'ST' },
    ]
  },
  'SEN': {
    formation: '4-3-3',
    lineup: [
      { number: 1, name: 'Mendy', position: 'GK' },
      { number: 2, name: 'Sabaly', position: 'RB' },
      { number: 3, name: 'Koulibaly', position: 'CB', isKey: true },
      { number: 5, name: 'Niakhaté', position: 'CB' },
      { number: 17, name: 'Jakobs', position: 'LB' },
      { number: 8, name: 'Gueye', position: 'CM' },
      { number: 6, name: 'Ciss', position: 'CM' },
      { number: 10, name: 'Kouyaté', position: 'CM' },
      { number: 19, name: 'Sarr', position: 'RW', isKey: true },
      { number: 9, name: 'Dia', position: 'ST' },
      { number: 7, name: 'Dièye', position: 'LW' },
    ]
  },
  'JPN': {
    formation: '4-3-3',
    lineup: [
      { number: 12, name: 'Gonda', position: 'GK' },
      { number: 2, name: 'Yamane', position: 'RB' },
      { number: 3, name: 'Itakura', position: 'CB' },
      { number: 5, name: 'Yoshida', position: 'CB' },
      { number: 6, name: 'Nagatomo', position: 'LB' },
      { number: 7, name: 'Endo', position: 'CM', isKey: true },
      { number: 8, name: 'Tanaka', position: 'CM' },
      { number: 10, name: 'Minamino', position: 'CM' },
      { number: 21, name: 'Kubo', position: 'RW', isKey: true },
      { number: 9, name: 'Ueda', position: 'ST' },
      { number: 14, name: 'Doan', position: 'LW' },
    ]
  },
  'AUS': {
    formation: '4-2-3-1',
    lineup: [
      { number: 1, name: 'Ryan', position: 'GK' },
      { number: 2, name: 'Degenek', position: 'RB' },
      { number: 5, name: 'Rowles', position: 'CB' },
      { number: 3, name: 'Souttar', position: 'CB' },
      { number: 15, name: 'Behich', position: 'LB' },
      { number: 8, name: 'Mooy', position: 'CDM', isKey: true },
      { number: 6, name: 'Irvine', position: 'CDM' },
      { number: 7, name: 'Leckie', position: 'RAM' },
      { number: 10, name: 'McGree', position: 'CAM', isKey: true },
      { number: 11, name: 'Baccus', position: 'LAM' },
      { number: 9, name: 'Duke', position: 'ST' },
    ]
  },
  'KOR': {
    formation: '4-3-3',
    lineup: [
      { number: 1, name: 'Kim S', position: 'GK' },
      { number: 2, name: 'Kim M', position: 'RB' },
      { number: 4, name: 'Kim Y', position: 'CB' },
      { number: 6, name: 'Jung', position: 'CB' },
      { number: 3, name: 'Kim J', position: 'LB' },
      { number: 5, name: 'Jung W', position: 'CM' },
      { number: 8, name: 'Lee J', position: 'CM', isKey: true },
      { number: 10, name: 'Lee K', position: 'CM' },
      { number: 7, name: 'Son H', position: 'RW', isKey: true },
      { number: 9, name: 'Cho G', position: 'ST' },
      { number: 11, name: 'Hwang H', position: 'LW' },
    ]
  },
  'COL': {
    formation: '4-2-3-1',
    lineup: [
      { number: 1, name: 'Vargas', position: 'GK' },
      { number: 2, name: 'Muñoz', position: 'RB', isKey: true },
      { number: 3, name: 'Sanchez', position: 'CB' },
      { number: 4, name: 'Lucumí', position: 'CB' },
      { number: 16, name: 'Mojica', position: 'LB' },
      { number: 6, name: 'Lerma', position: 'CDM' },
      { number: 8, name: 'Uribe', position: 'CDM' },
      { number: 11, name: 'Cuadrado', position: 'RAM' },
      { number: 10, name: 'J. Rodriguez', position: 'CAM', isKey: true },
      { number: 7, name: 'Díaz', position: 'LAM' },
      { number: 9, name: 'Falcao', position: 'ST' },
    ]
  },
  'NOR': {
    formation: '4-3-3',
    lineup: [
      { number: 1, name: 'Nyland', position: 'GK' },
      { number: 2, name: 'Pedersen', position: 'RB' },
      { number: 5, name: 'Ajer', position: 'CB' },
      { number: 6, name: 'Østigård', position: 'CB' },
      { number: 3, name: 'Meling', position: 'LB' },
      { number: 8, name: 'Berg', position: 'CM' },
      { number: 6, name: 'Odegaard', position: 'CM', isKey: true },
      { number: 10, name: 'Elyounoussi', position: 'CM' },
      { number: 7, name: 'Thorstvedt', position: 'RW' },
      { number: 9, name: 'Haaland', position: 'ST', isKey: true },
      { number: 11, name: 'Sørloth', position: 'LW' },
    ]
  },
  'NGA': {
    formation: '4-2-3-1',
    lineup: [
      { number: 1, name: 'Nwabili', position: 'GK' },
      { number: 2, name: 'Ola Aina', position: 'RB' },
      { number: 5, name: 'Troost-Ekong', position: 'CB', isKey: true },
      { number: 4, name: 'Bassey', position: 'CB' },
      { number: 3, name: 'Zaidu', position: 'LB' },
      { number: 8, name: 'Ndidi', position: 'CDM', isKey: true },
      { number: 6, name: 'Aribo', position: 'CDM' },
      { number: 7, name: 'Lookman', position: 'RAM' },
      { number: 10, name: 'Iwobi', position: 'CAM' },
      { number: 11, name: 'Chukwueze', position: 'LAM' },
      { number: 9, name: 'Osimhen', position: 'ST', isKey: true },
    ]
  },
  'EGY': {
    formation: '4-2-3-1',
    lineup: [
      { number: 1, name: 'El-Shenawy', position: 'GK' },
      { number: 2, name: 'Ashraf', position: 'RB' },
      { number: 5, name: 'Hegazi', position: 'CB' },
      { number: 6, name: 'Hamdi', position: 'CB' },
      { number: 3, name: 'Omar', position: 'LB' },
      { number: 8, name: 'El-Neny', position: 'CDM', isKey: true },
      { number: 6, name: 'Elneny', position: 'CDM' },
      { number: 11, name: 'Trezeguet', position: 'RAM' },
      { number: 10, name: 'Salah', position: 'CAM', isKey: true },
      { number: 7, name: 'Marmoush', position: 'LAM' },
      { number: 9, name: 'El-Sherbini', position: 'ST' },
    ]
  },
  'SUI': {
    formation: '4-2-3-1',
    lineup: [
      { number: 1, name: 'Sommer', position: 'GK' },
      { number: 2, name: 'Widmer', position: 'RB' },
      { number: 5, name: 'Akanji', position: 'CB', isKey: true },
      { number: 4, name: 'Elvedi', position: 'CB' },
      { number: 3, name: 'Rodriguez', position: 'LB' },
      { number: 8, name: 'Freuler', position: 'CDM' },
      { number: 6, name: 'Zakaria', position: 'CDM' },
      { number: 7, name: 'Shaqiri', position: 'RAM', isKey: true },
      { number: 10, name: 'Xhaka', position: 'CAM' },
      { number: 11, name: 'Steffen', position: 'LAM' },
      { number: 9, name: 'Embolo', position: 'ST' },
    ]
  },
  'ECU': {
    formation: '4-3-3',
    lineup: [
      { number: 1, name: 'Galíndez', position: 'GK' },
      { number: 2, name: 'Preciado', position: 'RB' },
      { number: 3, name: 'Hincapié', position: 'CB' },
      { number: 5, name: 'Pacho', position: 'CB' },
      { number: 6, name: 'Estupiñán', position: 'LB', isKey: true },
      { number: 8, name: 'Gruezo', position: 'CM' },
      { number: 10, name: 'Caicedo', position: 'CM', isKey: true },
      { number: 7, name: 'Plata', position: 'CM' },
      { number: 11, name: 'Sarmiento', position: 'RW' },
      { number: 9, name: 'Valencia', position: 'ST' },
      { number: 20, name: 'Cifuentes', position: 'LW' },
    ]
  },
  'CAN': {
    formation: '4-3-3',
    lineup: [
      { number: 1, name: 'Borjan', position: 'GK' },
      { number: 2, name: 'Johnston', position: 'RB' },
      { number: 5, name: 'Miller', position: 'CB' },
      { number: 4, name: 'Vitoria', position: 'CB' },
      { number: 3, name: 'Laryea', position: 'LB' },
      { number: 8, name: 'Eustaquio', position: 'CM', isKey: true },
      { number: 6, name: 'Osorio', position: 'CM' },
      { number: 10, name: 'Davies', position: 'CM', isKey: true },
      { number: 7, name: 'Buchanan', position: 'RW' },
      { number: 9, name: 'David', position: 'ST' },
      { number: 11, name: 'Larin', position: 'LW' },
    ]
  }
}

const genericLineup = (teamName: string) => ({
  formation: '4-3-3',
  lineup: [
    { number: 1, name: `${teamName} GK`, position: 'GK' },
    { number: 2, name: `${teamName} RB`, position: 'RB' },
    { number: 5, name: `${teamName} CB`, position: 'CB' },
    { number: 4, name: `${teamName} CB`, position: 'CB' },
    { number: 3, name: `${teamName} LB`, position: 'LB' },
    { number: 8, name: `${teamName} CM`, position: 'CM' },
    { number: 6, name: `${teamName} CDM`, position: 'CDM' },
    { number: 10, name: `${teamName} CAM`, position: 'CM' },
    { number: 7, name: `${teamName} RW`, position: 'RW' },
    { number: 9, name: `${teamName} ST`, position: 'ST', isKey: true },
    { number: 11, name: `${teamName} LW`, position: 'LW' },
  ]
})

export const getDemoLineup = (teamTLA: string) => {
  return DEMO_LINEUPS[teamTLA] || genericLineup(teamTLA)
}
