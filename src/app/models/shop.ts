
export interface ShopItem {
  name: string;
  stock?: number;
  cost: number;
  type: string;
}

export interface Shop {
  name: string;
  icon: string;
  cat: 'gl'|'jp';
  currency: string;
  aliases: string[];
  items: ShopItem[];
}
