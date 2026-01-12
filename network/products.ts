import { FeaturedDeal, Product } from "@/domain-models";
import { supabase } from "./instance";

interface RequestFetchAllProductsArgs {
  countrySlug: string;
  currentPage: number;
  pageSize: number;
  searchText?: string;
  categoryId?: string;
  language: string;
  options?: {
    abortSignal?: AbortSignal;
  };
}

const requestFetchAllProducts = async ({
  countrySlug,
  currentPage,
  pageSize,
  searchText,
  categoryId,
  language,
  options,
}: RequestFetchAllProductsArgs): Promise<{
  data: Product[];
}> => {
  const offset = (currentPage - 1) * pageSize;
  let query = supabase
    .from("products")
    .select("*")
    .eq("country_slug", countrySlug)
    .eq("language", language)
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

interface RequestFetchSingleProductArgs {
  slug: string;
}

const requestFetchSingleProduct = async ({
  slug,
}: RequestFetchSingleProductArgs): Promise<{ data: Product }> => {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("slug", slug)
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return { data };
};

interface RequestFetchAllFeaturedProductsArgs {
  countrySlug: string;
  currentPage: number;
  pageSize: number;
}
const requestFetchAllFeaturedProducts = async ({
  countrySlug,
  currentPage,
  pageSize,
}: RequestFetchAllFeaturedProductsArgs): Promise<{ data: Product[] }> => {
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

export {
  requestFetchAllProducts,
  requestFetchSingleProduct,
  requestFetchAllFeaturedProducts,
};
