import { type Product } from "./db";
import { getProductByIdFn } from "./api/db.functions";

export type { Product };

// Static export for compatibility.
// Loaders now fetch products dynamically using server functions.
export const products: Product[] = [];

export const getProduct = async (id: string) => {
  return getProductByIdFn({ data: id });
};
