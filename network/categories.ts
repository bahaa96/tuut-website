import { supabase } from "./instance";
import { Category } from "@/domain-models";

interface RequestFetchAllCategoriesArgs {
  currentPage: number;
  pageSize: number;
}

const requestFetchAllCategories = async ({
  currentPage,
  pageSize,
}: RequestFetchAllCategoriesArgs): Promise<{ data: Category[] }> => {
  const offset = (currentPage - 1) * pageSize;
  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .range(offset, offset + pageSize - 1);

  if (error) {
    throw new Error(error.message);
  }

  return { data };
};

export { requestFetchAllCategories };
