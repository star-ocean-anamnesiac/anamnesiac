import { Meta } from './meta';

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
  effects?: Effect[];
}

export interface Skill {

  // the name of the skill
  name: string;

  // the picture for the skill
  picture: string;

  // the power of the skill (f.ex, INT x 5000%)
  power?: string;

  // the ap cost of the skill
  ap?: number;

  // the number of max hits the skill can do
  maxHits?: number;

  // the element of the skill
  element?: string;

  // user entered notes. does not support markdown!
  notes?: string;

  // if this skill should be higlighted
  highlight?: boolean;

  // the skill metadata
  meta?: Meta;
}

export interface Effect {

  // the description of the effect
  desc: string;

  // whether or not it hits all allies. if it hits a specific subset of allies, specify the type (ex: invoker/Sophia)
  all?: boolean|string;

  // how long the effect lasts in seconds
  duration?: number;

  // the effect metadata
  meta?: Meta;
}

export interface Character {

  // the character name (IT MUST BE UNIQUE)
  name: string;

  // the character type (attacker, defender, etc) - do not set this, it is handled automatically
  type: string;

  // whether the character is on global or jp
  cat: string;

  // whether the character is awakened or not - set to true for awk10, and 9 for awk9
  awakened?: boolean|number;

  // the rating 0-10
  rating: number;

  // a ref to the picture of the character (in assets/character)
  picture: string;

  // the weapon type the character uses. use the shorthand (ie, ohs) not the expanded form (One Handed Sword)
  weapon: string;

  // whether the character is ace or not
  ace?: boolean;

  // whether the character is limited or not
  limited?: boolean;

  // the rating of the character in game (3/4/5)
  star: number;

  // character stats. see above for what this contains
  stats: StatBlock;

  // the list of talents for the character. see above for what this contains.
  talents: Talent[];

  // the list of skills for the character. see above for what this contains.
  skills: Skill[];

  // the rush effect for the character. it can contain fields from Talent and Skill
  rush: Talent & Skill;

  // the personalized notes for the character. long form text can be entered here.
  notes?: string;
}
