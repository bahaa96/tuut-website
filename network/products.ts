import { Product } from "@/domain-models";
import { supabase } from "./instance";

interface RequestFetchAllProductsArgs {
  countrySlug: string;
  currentPage: number;
  pageSize: number;
  searchText?: string;
  categoryId?: string;
}

const requestFetchAllProducts = async ({
  countrySlug,
  currentPage,
  pageSize,
  searchText,
  categoryId,
}: RequestFetchAllProductsArgs): Promise<{ data: Product[] }> => {
  const offset = (currentPage - 1) * pageSize;
  let query = supabase
    .from("products")
    .select("*")
    .eq("country_slug", countrySlug)
    .range(offset, offset + pageSize - 1);

  if (searchText) {
    query = query.textSearch("title_en || title_ar", searchText);
  }

  if (categoryId) {
    query = query.eq("category_id", categoryId);
  }

  const { data, error } = await query.select();

  if (error) {
    throw new Error(error.message);
  }
  return { data };
};

export { requestFetchAllProducts };
