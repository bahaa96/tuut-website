import { Deal, FeaturedDeal } from "@/domain-models";
import { supabase } from "./instance";
import { DealWithStore } from "@/domain-models/deal";
import { edgeServerAppPaths } from "next/dist/build/webpack/plugins/pages-manifest-plugin";

interface RequestFetchAllDealsArgs {
  countrySlug: string;
  currentPage: number;
  pageSize: number;
  searchText?: string;
  categoryId?: string;
  storeId?: string;
}

const requestFetchAllDeals = async ({
  countrySlug,
  currentPage,
  pageSize,
  searchText,
  categoryId,
  storeId,
}: RequestFetchAllDealsArgs): Promise<{ data: Deal[] }> => {
  const offset = currentPage * pageSize;
  let query = supabase
    .from("deals")
    .select("*, stores!deals_store_id_fkey(*)")
    .eq("country_slug", countrySlug)
    .range(offset, offset + pageSize - 1);

  if (searchText) {
    query = query.textSearch("title_en || title_ar", searchText);
  }
  if (storeId) {
    query = query.eq("store_id", storeId);
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

interface RequestFetchAllFeaturedDealsArgs {
  countrySlug: string;
  currentPage: number;
  pageSize: number;
}
const requestFetchAllFeaturedDeals = async ({
  countrySlug,
  currentPage,
  pageSize,
}: RequestFetchAllFeaturedDealsArgs): Promise<{ data: FeaturedDeal[] }> => {
  const offset = currentPage * pageSize;
  const { data, error } = await supabase
    .from("featured_deals")
    .select("*, deals(*)")
    .eq("country_slug", countrySlug)
    .range(offset, offset + pageSize);

  if (error) {
    throw new Error(error.message);
  }

  return { data };
};

interface RequestFetchAllDealsLiteArgs {
  countrySlug: string;
  currentPage: number;
  pageSize: number;
}
const requestFetchAllDealsLite = async ({
  countrySlug,
  currentPage,
  pageSize,
}: RequestFetchAllDealsLiteArgs): Promise<{ data: Deal[] }> => {
  const offset = (currentPage - 1) * pageSize;
  const { data, error } = await supabase
    .from("deals")
    .select("*")
    .eq("country_slug", countrySlug)
    .range(offset, offset + pageSize - 1);

  if (error) {
    throw new Error(error.message);
  }

  return { data };
};

export {
  requestFetchAllDeals,
  requestFetchAllFeaturedDeals,
  requestFetchAllDealsLite,
};
