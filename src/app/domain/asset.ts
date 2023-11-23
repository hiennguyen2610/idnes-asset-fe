import { PlanList } from "./PlanList";
import { ShoppingPlan } from "./ShoppingPlan";
import { Supplier } from "./Supplier";


export class Asset {
  id: number;
  itemCode: string;
  price: number;
  warrantyStartDate: Date;   // Ngày bắt đầu bảo hành
  contractCode: string;
  contractName: string;
  warrantyPeriod: number;
  supplier: Supplier[];
  productOrigin: string;
  planList: PlanList[];
  shoppingPlan: ShoppingPlan[];
  }