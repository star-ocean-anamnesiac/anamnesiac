
export interface Weakness {

  // a "plain" weakness, like, INT damage
  plain?: string;

  // a specific element, see Item->Factor#element
  element?: string;

  // the percent weakness
  percentWeakness?: number;

  // the status effect weakness
  status?: string;

  // the vulnerability string - Low, Med, High, Imm
  vuln?: string;
}

export interface BossMove {

  // the skill name
  name: string;

  // the long-text description of the move. markdown supported.
  desc: string;

  // who does it target? Anyone? Close range?
  targets?: string;

  // is it symbology?
  isSymbology?: boolean;

  // is it their enrage skill?
  isEnrage?: boolean;

  // is it present in m1, m2, m3?
  m1?: boolean;
  m2?: boolean;
  m3?: boolean;
}

export interface Recommendation {

  // for recs like "INT damage dealers"
  plain?: string;

  // specific unit name ("Sophia")
  unit?: string;
}

export interface Enrage {

  // xx:xx for m1, m2, m3
  m1: string;
  m2?: string;
  m3?: string;
}

export interface BossGuide {

  // the name of the boss
  name: string;

  // the event name for the boss
  eventName: string;

  // boss aliases
  aliases?: string[];

  // whether or not the boss fight is active
  isActive?: boolean;

  // the boss sprite image
  image: string;

  // 'jp' or 'gl'
  cat: string;

  // one of the valid races (see Item->Factor#slayer)
  race: string;

  // the big "about" blob for the boss. markdown supported.
  desc: string;

  // the boss weaknesses
  weaknesses: Weakness[];

  // the boss resistances
  resistances?: Weakness[];

  // the status effects the boss inflicts
  statusInflictions?: string[];

  // the skills the boss can use
  moves: BossMove[];

  // recommendations for what to use on the boss
  recommendations?: Recommendation[];

  // the enrage block for the boss
  enrage: Enrage;
}
