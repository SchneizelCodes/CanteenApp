import { StudentModel } from "./StudentModel";
import { MenuItem } from "./MenuItem";

export class PreOrderModel {
  quantity: number;
  student: StudentModel | null;
  item: MenuItem | null;

  constructor(
    quantity: number = 1,
    student: StudentModel | null = null,
    item: MenuItem | null = null
  ) {
    this.quantity = quantity;
    this.student = student;
    this.item = item;
  }

  // Task B5: Encapsulated business rule. Return Item.Price * Quantity, or 0 if item is null.
  public getTotal(): number {
    if (!this.item) {
      return 0;
    }
    return Math.round(this.item.price * this.quantity * 100) / 100;
  }

  // C# naming alias: GetTotal
  public GetTotal(): number {
    return this.getTotal();
  }
}