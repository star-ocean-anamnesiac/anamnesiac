
export interface Factor {
  desc: string;
}

export interface Item {

  // item name
  name: string;

  // whether the character is on global or jp
  cat: 'gl'|'jp';

  // item type - this is done internally, automatically
  type: 'weapon'|'accessory';

  // item subtype - this is done internally, automatically
  subtype: string;

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

  // the element of the item, if given
  element?: string;

  // the list of factors for an item
  factors: Factor[];

  // the LB level the third factor is obtained at (0-5)
  thirdFactorLB?: number;

  // where the item is obtained (Gacha, Shop, etc)
  obtained: string;

  // item notes
  notes?: string;
}
