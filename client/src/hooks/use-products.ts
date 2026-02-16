import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, buildUrl } from "@shared/routes";

// GET /api/products
export function useProducts(filters?: { category?: string, brand?: string, search?: string, sort?: string, minPrice?: number, maxPrice?: number }) {
  return useQuery({
    queryKey: [api.products.list.path, filters],
    queryFn: async () => {
      const url = buildUrl(api.products.list.path, filters || {});
      const res = await fetch(url, { credentials: "include" });
      if (!res.ok) throw new Error('Failed to fetch products');
      return api.products.list.responses[200].parse(await res.json());
    },
  });
}

// GET /api/products/:id
export function useProduct(id: number) {
  return useQuery({
    queryKey: [api.products.get.path, id],
    queryFn: async () => {
      const url = buildUrl(api.products.get.path, { id });
      const res = await fetch(url, { credentials: "include" });
      if (res.status === 404) return null;
      if (!res.ok) throw new Error('Failed to fetch product');
      return api.products.get.responses[200].parse(await res.json());
    },
  });
}

// GET /api/categories
export function useCategories() {
  return useQuery({
    queryKey: [api.categories.list.path],
    queryFn: async () => {
      const res = await fetch(api.categories.list.path, { credentials: "include" });
      if (!res.ok) throw new Error('Failed to fetch categories');
      return api.categories.list.responses[200].parse(await res.json());
    },
  });
}
