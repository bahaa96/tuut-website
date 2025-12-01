import { supabase } from "./instance";
import { Store } from "@/domain-models";

interface RequestFetchAllStoresArgs {
  countrySlug: string;
  currentPage: number;
  pageSize: number;
}

const requestFetchAllStores = async ({
  countrySlug,
  currentPage,
  pageSize,
}: RequestFetchAllStoresArgs): Promise<{ data: Store[] }> => {
  const offset = (currentPage - 1) * pageSize;
  const { data, error } = await supabase
    .from("stores")
    .select("*")
    .eq("country_slug", countrySlug)
    .range(offset, offset + pageSize - 1);

  if (error) {
    throw new Error(error.message);
  }

  return { data };
};

export { requestFetchAllStores };
