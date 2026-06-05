import { createServerFn } from "@tanstack/react-start";
import { db } from "../db";
import { z } from "zod";

export const getProductsFn = createServerFn({ method: "GET" })
  .handler(async () => {
    return db.getProducts();
  });

export const getProductByIdFn = createServerFn({ method: "GET" })
  .inputValidator(z.string())
  .handler(async ({ data: id }) => {
    return db.getProductById(id);
  });

export const getContentBlockByKeyFn = createServerFn({ method: "GET" })
  .inputValidator(z.string())
  .handler(async ({ data: key }) => {
    return db.getContentBlockByKey(key);
  });

export const getBlogPostsFn = createServerFn({ method: "GET" })
  .handler(async () => {
    return db.getBlogPosts();
  });
