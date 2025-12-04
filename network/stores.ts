import { supabase } from "./instance";
import { Store } from "@/domain-models";

interface RequestFetchAllStoresArgs {
  countrySlug: string;
  currentPage: number;
  pageSize: number;
  searchText?: string;
  categoryId?: string;
  storeId?: string;
}

const requestFetchAllStores = async ({
  countrySlug,
  currentPage,
  pageSize,
  searchText,
  categoryId,
}: RequestFetchAllStoresArgs): Promise<{ data: Store[] }> => {
  const offset = (currentPage - 1) * pageSize;
  let query = supabase
    .from("stores")
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

export { requestFetchAllStores };
