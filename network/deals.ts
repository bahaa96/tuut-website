import { Deal, FeaturedDeal } from "@/domain-models";
import { supabase } from "./instance";
import { DealWithStore } from "@/domain-models/deal";

interface RequestFetchAllDealsArgs {
  countrySlug: string;
  currentPage: number;
  pageSize: number;
}

const requestFetchAllDeals = async ({
  countrySlug,
  currentPage,
  pageSize,
}: RequestFetchAllDealsArgs): Promise<{ data: Deal[] }> => {
  const offset = (currentPage - 1) * pageSize;
  const { data, error } = await supabase
    .from("deals")
    .select("*, stores(*)")
    .eq("country_slug", countrySlug)
    .range(offset, offset + pageSize - 1);

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
    .select("*, deals(*)")
    .eq("country_slug", countrySlug)
    .range(offset, offset + pageSize - 1);

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
