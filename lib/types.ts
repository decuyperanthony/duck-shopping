import type { CategoryId } from "./categories";

export interface ShoppingItemLocal {
  id: string;
  serverId?: number;
  title: string;
  category: CategoryId;
  completed: boolean;
  quantity: number;
  note: string;
  createdAt: string;
  updatedAt: string;
  synced: boolean;
  deleted: boolean;
}

export type NewItemInput = {
  title: string;
  category: CategoryId;
  quantity: number;
  note: string;
};
