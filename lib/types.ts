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

export interface TemplateItem {
  title: string;
  category: CategoryId;
  quantity: number;
  note: string;
}

export interface ListTemplate {
  id: string;
  name: string;
  items: TemplateItem[];
  createdAt: string;
  updatedAt: string;
}

export type ServerItem = {
  id: number;
  title: string;
  category: string;
  completed: boolean;
  quantity: number;
  note: string | null;
  createdAt: string;
  updatedAt: string;
};
