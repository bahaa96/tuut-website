import { Product } from "@/domain-models";
import { supabase } from "./instance";

interface RequestFetchAllProductsArgs {
  countrySlug: string;
  currentPage: number;
  pageSize: number;
}

const requestFetchAllProducts = async ({
  countrySlug,
  currentPage,
  pageSize,
}: RequestFetchAllProductsArgs): Promise<{ data: Product[] }> => {
  const offset = (currentPage - 1) * pageSize;
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("country_slug", countrySlug)
    .range(offset, offset + pageSize - 1);

  if (error) {
    throw new Error(error.message);
  }

  return { data };
};

export { requestFetchAllProducts };
