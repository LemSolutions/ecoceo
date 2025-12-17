// Lista di comuni italiani principali con relative province
export interface ItalianCity {
  name: string;
  province: string;
  provinceCode: string;
  postalCode: string;
}

export const italianCities: ItalianCity[] = [
  // Lombardia - Provincia MB (Monza e Brianza)
  { name: 'Monza', province: 'Monza e Brianza', provinceCode: 'MB', postalCode: '20900' },
  { name: 'Brugherio', province: 'Monza e Brianza', provinceCode: 'MB', postalCode: '20861' },
  { name: 'Desio', province: 'Monza e Brianza', provinceCode: 'MB', postalCode: '20832' },
  { name: 'Seregno', province: 'Monza e Brianza', provinceCode: 'MB', postalCode: '20831' },
  { name: 'Lissone', province: 'Monza e Brianza', provinceCode: 'MB', postalCode: '20851' },
  { name: 'Cesano Maderno', province: 'Monza e Brianza', provinceCode: 'MB', postalCode: '20811' },
  { name: 'Vimercate', province: 'Monza e Brianza', provinceCode: 'MB', postalCode: '20871' },
  { name: 'Biassono', province: 'Monza e Brianza', provinceCode: 'MB', postalCode: '20853' },
  { name: 'Villasanta', province: 'Monza e Brianza', provinceCode: 'MB', postalCode: '20852' },
  
  // Lombardia - Provincia MI (Milano)
  { name: 'Milano', province: 'Milano', provinceCode: 'MI', postalCode: '20100' },
  { name: 'Sesto San Giovanni', province: 'Milano', provinceCode: 'MI', postalCode: '20099' },
  { name: 'Cinisello Balsamo', province: 'Milano', provinceCode: 'MI', postalCode: '20092' },
  { name: 'Legnano', province: 'Milano', provinceCode: 'MI', postalCode: '20025' },
  { name: 'Rho', province: 'Milano', provinceCode: 'MI', postalCode: '20017' },
  { name: 'Cologno Monzese', province: 'Milano', provinceCode: 'MI', postalCode: '20093' },
  { name: 'Paderno Dugnano', province: 'Milano', provinceCode: 'MI', postalCode: '20037' },
  
  // Lombardia - Provincia BG (Bergamo)
  { name: 'Bergamo', province: 'Bergamo', provinceCode: 'BG', postalCode: '24100' },
  { name: 'Treviglio', province: 'Bergamo', provinceCode: 'BG', postalCode: '24047' },
  { name: 'Dalmine', province: 'Bergamo', provinceCode: 'BG', postalCode: '24044' },
  
  // Lombardia - Provincia BS (Brescia)
  { name: 'Brescia', province: 'Brescia', provinceCode: 'BS', postalCode: '25100' },
  { name: 'Desenzano del Garda', province: 'Brescia', provinceCode: 'BS', postalCode: '25015' },
  
  // Lombardia - Provincia VA (Varese)
  { name: 'Varese', province: 'Varese', provinceCode: 'VA', postalCode: '21100' },
  { name: 'Busto Arsizio', province: 'Varese', provinceCode: 'VA', postalCode: '21052' },
  
  // Lombardia - Provincia CO (Como)
  { name: 'Como', province: 'Como', provinceCode: 'CO', postalCode: '22100' },
  
  // Lombardia - Provincia PV (Pavia)
  { name: 'Pavia', province: 'Pavia', provinceCode: 'PV', postalCode: '27100' },
  
  // Lombardia - Provincia CR (Cremona)
  { name: 'Cremona', province: 'Cremona', provinceCode: 'CR', postalCode: '26100' },
  
  // Lombardia - Provincia MN (Mantova)
  { name: 'Mantova', province: 'Mantova', provinceCode: 'MN', postalCode: '46100' },
  
  // Lombardia - Provincia LO (Lodi)
  { name: 'Lodi', province: 'Lodi', provinceCode: 'LO', postalCode: '26900' },
  
  // Lombardia - Provincia SO (Sondrio)
  { name: 'Sondrio', province: 'Sondrio', provinceCode: 'SO', postalCode: '23100' },
  
  // Piemonte
  { name: 'Torino', province: 'Torino', provinceCode: 'TO', postalCode: '10100' },
  { name: 'Novara', province: 'Novara', provinceCode: 'NO', postalCode: '28100' },
  { name: 'Alessandria', province: 'Alessandria', provinceCode: 'AL', postalCode: '15100' },
  
  // Veneto
  { name: 'Venezia', province: 'Venezia', provinceCode: 'VE', postalCode: '30100' },
  { name: 'Verona', province: 'Verona', provinceCode: 'VR', postalCode: '37100' },
  { name: 'Padova', province: 'Padova', provinceCode: 'PD', postalCode: '35100' },
  { name: 'Vicenza', province: 'Vicenza', provinceCode: 'VI', postalCode: '36100' },
  
  // Emilia-Romagna
  { name: 'Bologna', province: 'Bologna', provinceCode: 'BO', postalCode: '40100' },
  { name: 'Modena', province: 'Modena', provinceCode: 'MO', postalCode: '41100' },
  { name: 'Parma', province: 'Parma', provinceCode: 'PR', postalCode: '43100' },
  { name: 'Reggio nell\'Emilia', province: 'Reggio nell\'Emilia', provinceCode: 'RE', postalCode: '42100' },
  { name: 'Ferrara', province: 'Ferrara', provinceCode: 'FE', postalCode: '44100' },
  { name: 'Rimini', province: 'Rimini', provinceCode: 'RN', postalCode: '47900' },
  
  // Toscana
  { name: 'Firenze', province: 'Firenze', provinceCode: 'FI', postalCode: '50100' },
  { name: 'Pisa', province: 'Pisa', provinceCode: 'PI', postalCode: '56100' },
  { name: 'Siena', province: 'Siena', provinceCode: 'SI', postalCode: '53100' },
  { name: 'Arezzo', province: 'Arezzo', provinceCode: 'AR', postalCode: '52100' },
  
  // Lazio
  { name: 'Roma', province: 'Roma', provinceCode: 'RM', postalCode: '00100' },
  { name: 'Latina', province: 'Latina', provinceCode: 'LT', postalCode: '04100' },
  { name: 'Frosinone', province: 'Frosinone', provinceCode: 'FR', postalCode: '03100' },
  
  // Campania
  { name: 'Napoli', province: 'Napoli', provinceCode: 'NA', postalCode: '80100' },
  { name: 'Salerno', province: 'Salerno', provinceCode: 'SA', postalCode: '84100' },
  { name: 'Caserta', province: 'Caserta', provinceCode: 'CE', postalCode: '81100' },
  
  // Puglia
  { name: 'Bari', province: 'Bari', provinceCode: 'BA', postalCode: '70100' },
  { name: 'Taranto', province: 'Taranto', provinceCode: 'TA', postalCode: '74100' },
  { name: 'Lecce', province: 'Lecce', provinceCode: 'LE', postalCode: '73100' },
  
  // Sicilia
  { name: 'Palermo', province: 'Palermo', provinceCode: 'PA', postalCode: '90100' },
  { name: 'Catania', province: 'Catania', provinceCode: 'CT', postalCode: '95100' },
  { name: 'Messina', province: 'Messina', provinceCode: 'ME', postalCode: '98100' },
  
  // Sardegna
  { name: 'Cagliari', province: 'Cagliari', provinceCode: 'CA', postalCode: '09100' },
  { name: 'Sassari', province: 'Sassari', provinceCode: 'SS', postalCode: '07100' },
  
  // Abruzzo
  { name: 'L\'Aquila', province: 'L\'Aquila', provinceCode: 'AQ', postalCode: '67100' },
  { name: 'Pescara', province: 'Pescara', provinceCode: 'PE', postalCode: '65100' },
  
  // Marche
  { name: 'Ancona', province: 'Ancona', provinceCode: 'AN', postalCode: '60100' },
  { name: 'Pesaro', province: 'Pesaro e Urbino', provinceCode: 'PU', postalCode: '61100' },
  
  // Umbria
  { name: 'Perugia', province: 'Perugia', provinceCode: 'PG', postalCode: '06100' },
  { name: 'Terni', province: 'Terni', provinceCode: 'TR', postalCode: '05100' },
  
  // Liguria
  { name: 'Genova', province: 'Genova', provinceCode: 'GE', postalCode: '16100' },
  { name: 'La Spezia', province: 'La Spezia', provinceCode: 'SP', postalCode: '19100' },
  
  // Calabria
  { name: 'Reggio di Calabria', province: 'Reggio di Calabria', provinceCode: 'RC', postalCode: '89100' },
  { name: 'Cosenza', province: 'Cosenza', provinceCode: 'CS', postalCode: '87100' },
  
  // Basilicata
  { name: 'Potenza', province: 'Potenza', provinceCode: 'PZ', postalCode: '85100' },
  
  // Molise
  { name: 'Campobasso', province: 'Campobasso', provinceCode: 'CB', postalCode: '86100' },
  
  // Trentino-Alto Adige
  { name: 'Trento', province: 'Trento', provinceCode: 'TN', postalCode: '38100' },
  { name: 'Bolzano', province: 'Bolzano', provinceCode: 'BZ', postalCode: '39100' },
  
  // Friuli-Venezia Giulia
  { name: 'Trieste', province: 'Trieste', provinceCode: 'TS', postalCode: '34100' },
  { name: 'Udine', province: 'Udine', provinceCode: 'UD', postalCode: '33100' },
  
  // Valle d'Aosta
  { name: 'Aosta', province: 'Aosta', provinceCode: 'AO', postalCode: '11100' },
];

/**
 * Cerca città per nome (case-insensitive, parziale)
 */
export const searchCities = (query: string): ItalianCity[] => {
  if (!query || query.length < 2) return [];
  
  const lowerQuery = query.toLowerCase().trim();
  return italianCities.filter(city => 
    city.name.toLowerCase().includes(lowerQuery) ||
    city.province.toLowerCase().includes(lowerQuery) ||
    city.provinceCode.toLowerCase().includes(lowerQuery)
  ).slice(0, 10); // Limita a 10 risultati
};

/**
 * Trova una città per nome esatto
 */
export const findCityByName = (name: string): ItalianCity | undefined => {
  return italianCities.find(city => 
    city.name.toLowerCase() === name.toLowerCase().trim()
  );
};

