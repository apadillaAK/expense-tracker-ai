import {
  Car,
  Film,
  MoreHorizontal,
  Receipt,
  ShoppingBag,
  Utensils,
  type LucideIcon,
} from "lucide-react";
import type { Category } from "@/types/expense";

interface CategoryMeta {
  /** Hex color for charts. */
  color: string;
  /** Tailwind classes for pill badges. */
  badge: string;
  /** Tailwind classes for icon tiles. */
  tile: string;
  icon: LucideIcon;
}

export const CATEGORY_META: Record<Category, CategoryMeta> = {
  Food: {
    color: "#f97316",
    badge: "bg-orange-50 text-orange-700 ring-orange-600/20",
    tile: "bg-orange-100 text-orange-600",
    icon: Utensils,
  },
  Transportation: {
    color: "#3b82f6",
    badge: "bg-blue-50 text-blue-700 ring-blue-600/20",
    tile: "bg-blue-100 text-blue-600",
    icon: Car,
  },
  Entertainment: {
    color: "#a855f7",
    badge: "bg-purple-50 text-purple-700 ring-purple-600/20",
    tile: "bg-purple-100 text-purple-600",
    icon: Film,
  },
  Shopping: {
    color: "#ec4899",
    badge: "bg-pink-50 text-pink-700 ring-pink-600/20",
    tile: "bg-pink-100 text-pink-600",
    icon: ShoppingBag,
  },
  Bills: {
    color: "#14b8a6",
    badge: "bg-teal-50 text-teal-700 ring-teal-600/20",
    tile: "bg-teal-100 text-teal-600",
    icon: Receipt,
  },
  Other: {
    color: "#64748b",
    badge: "bg-slate-100 text-slate-700 ring-slate-600/20",
    tile: "bg-slate-200 text-slate-600",
    icon: MoreHorizontal,
  },
};
