
import client from "./client";

export const getSavedProducts = () =>
  client.get("/saved-products");

export const saveProduct = (product) =>
  client.post("/saved-products", product);

export const deleteSavedProduct = (savedProductId) =>
  client.delete(`/saved-products/${savedProductId}`);
