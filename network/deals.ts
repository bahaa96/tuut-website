import { Deal, FeaturedDeal } from "@/domain-models";
import { supabase } from "./instance";

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
  const offset = (currentPage - 1) * pageSize;
  let query = supabase
    .from("deals")
    .select("*, store:store_id(*)")
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
  const offset = (currentPage - 1) * pageSize;
  const { data, error } = await supabase
    .from("featured_deals")
    .select("*, deal:deal_id(*)")
    .eq("country_slug", countrySlug)
    .range(offset, offset + pageSize - 1);

  if (error) {
    throw new Error(error.message);
  }

  return { data };
};

interface RequestFetchSingleDealArgs {
  slug: string;
}
const requestFetchSingleDeal = async ({
  slug,
}: RequestFetchSingleDealArgs): Promise<{ data: Deal | null }> => {
  // this decode is needed as most slugs are in Arabic
  const decodedSlug = decodeURIComponent(slug);
  const { data, error } = await supabase
    .from("deals")
    .select("*, store:store_id(*)")
    .or(`slug_en.eq.${decodedSlug},slug_ar.eq.${decodedSlug}`)
    .single();
  if (error) {
    throw new Error(error.message);
  }
  return { data };
};

interface RequestFetchRandomDealsArgs {
  countrySlug: string;
  count: number;
}
const requestFetchRandomDeals = async ({
  countrySlug,
  count,
}: RequestFetchRandomDealsArgs): Promise<{ data: Deal[] }> => {
  const randomOffset = Math.floor(Math.random() * 50);
  const { data, error } = await supabase
    .from("deals")
    .select("*")
    .eq("country_slug", countrySlug)
    .range(randomOffset, randomOffset + count - 1);

  if (error) {
    throw new Error(error.message);
  }
  return { data };
};

export {
  requestFetchAllDeals,
  requestFetchAllFeaturedDeals,
  requestFetchSingleDeal,
  requestFetchRandomDeals,
};
