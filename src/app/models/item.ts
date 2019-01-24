import { Meta } from './meta';

export interface Factor {
  desc: string;

  meta?: Meta;
}

export interface Item {

  // item name
  name: string;

  // whether the character is on global or jp
  cat: string;

  // item type - this is done internally, automatically
  type?: string;

  // item subtype - this is done internally, automatically
  subtype?: string;

  // the star rating in game (1-5)
  star: number;

  // a ref to the picture of the character (in assets/item)
  picture: string;

  // the level 20 atk of the item (for weapons)
  atk?: number;

  // the level 20 int of the item (for weapons)
  int?: number;

  // the level 20 def of the item (for accessories)
  def?: number;

  // the element of the item, if given - Dark|Earth|Fire|Ice|Light|Lightning|Wind
  element?: string;

  // the type of slayer it is - Beast|Bird|Demon|Divinity|Dragon|Human|Insect|Machine|Plant|Undead
  slayer?: string;

  // the list of factors for an item
  factors: Factor[];

  // the LB level the third factor is obtained at (0-5)
  thirdFactorLB?: number;

  // where the item is obtained (Gacha, Shop, etc)
  obtained: string;

  // item notes
  notes?: string;
}
