import { MenuItem } from "@/models/MenuItem";

export const menuCatalog: MenuItem[] = [
  new MenuItem({ id: 1, name: "Chicken Adobo", category: "Meals", price: 65.0, isAvailable: true }),
  new MenuItem({ id: 2, name: "Pork Sinigang", category: "Meals", price: 75.0, isAvailable: true }),
  new MenuItem({ id: 3, name: "Iced Tea", category: "Drinks", price: 20.0, isAvailable: true }),
  new MenuItem({ id: 4, name: "Buko Juice", category: "Drinks", price: 25.0, isAvailable: false }),
  new MenuItem({ id: 5, name: "Turon", category: "Snacks", price: 15.0, isAvailable: true }),
  new MenuItem({ id: 6, name: "Banana Cue", category: "Snacks", price: 15.0, isAvailable: true }),
  new MenuItem({ id: 7, name: "Teriyaki Wings", category: "Meals", price: 85.0, isAvailable: true }),
];