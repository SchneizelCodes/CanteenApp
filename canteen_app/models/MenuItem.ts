// models/MenuItem.ts
export interface IMenuItem {
  id: number;
  name: string;
  category: "Meals" | "Drinks" | "Snacks" | string;
  price: number;
  isAvailable: boolean;
}

export class MenuItem implements IMenuItem {
  id: number;
  name: string;
  category: string;
  price: number;
  isAvailable: boolean;

  constructor(data: IMenuItem) {
    this.id = data.id;
    this.name = data.name;
    this.category = data.category;
    this.price = data.price;
    this.isAvailable = data.isAvailable;
  }

  // Task A1: Subtracts percent discount (e.g. 10% on 65.00 -> 58.50)
  public getDiscountedPrice(percent: number = 10): number {
    const discount = this.price * (percent / 100);
    return Math.round((this.price - discount) * 100) / 100;
  }

  // C# naming alias: GetDiscountedPrice
  public GetDiscountedPrice(percent: number = 10): number {
    return this.getDiscountedPrice(percent);
  }

  get Id() { return this.id; }
  get Name() { return this.name; }
  get Category() { return this.category; }
  get Price() { return this.price; }
  get IsAvailable() { return this.isAvailable; }
}