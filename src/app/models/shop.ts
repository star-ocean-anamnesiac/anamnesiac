
export interface ShopItem {
  name: string;
  stock?: number;
  cost: number;
  type: string;
}

export interface Shop {
  name: string;
  icon: string;
  cat: string;
  currency: string;
  aliases: string[];
  items: ShopItem[];
}
