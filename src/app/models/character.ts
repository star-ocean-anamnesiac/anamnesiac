

export interface StatBlock {
  hp: number;
  atk: number;
  int: number;
  def: number;
  hit: number;
  grd: number;
}

export interface Talent {

  // the name of the talent
  name: string;

  // the effects contained in the talent
  effects: Effect[];
}

export interface Skill {

  // the name of the skill
  name: string;

  // the power of the skill (f.ex, INT x5000%)
  power: string;

  // the ap cost of the skill
  ap: number;

  // the number of max hits the skill can do
  maxHits: number;

  // the element of the skill
  element?: string;
}

export interface Effect {

  // the description of the effect
  desc: string;

  // whether or not it hits all allies. if it hits a specific subset of allies, specify the type (ex: invoker/Sophia)
  all?: boolean|string;

  // how long the effect lasts in seconds
  duration?: number;
}

export interface Character {

  // the character name (IT MUST BE UNIQUE)
  name: string;

  // the character type (attacker, defender, etc) - do not set this, it is handled automatically
  type: string;

  // whether the character is on global or jp
  cat: 'gl' | 'jp';

  // the rating 0-10
  rating: number;

  // a url to the picture of the character
  picture: string;

  // the weapon type the character uses. use the shorthand (ie, ohs) not the expanded form (One Handed Sword)
  weapon: string;

  // whether the character is ace or not
  ace: boolean;

  // whether the character is limited or not
  limited: boolean;

  // the rating of the character in game (3/4/5)
  star: number;

  // character stats. see above for what this contains
  stats: StatBlock;

  // the list of talents for the character. see above for what this contains.
  talents: Talent[];

  // the list of skills for the character. see above for what this contains.
  skills: Skill[];

  // the rush effect for the character. it can contain fields from Effect and Skill
  rush: Effect & Skill;

  // the personalized notes for the character. long form text can be entered here.
  notes?: string;
}
