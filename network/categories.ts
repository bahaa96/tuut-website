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

interface RequestFetchSingleCategoryBySlugArgs {
  slug: string;
}
const requestFetchSingleCategoryBySlug = async ({
  slug,
}: RequestFetchSingleCategoryBySlugArgs): Promise<{
  data: Category | null;
}> => {
  const decodedSlug = decodeURIComponent(slug);
  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .or(`slug_en.eq.${decodedSlug},slug_ar.eq.${decodedSlug}`)
    .single();
  if (error) {
    throw new Error(error.message);
  }
  return { data };
};
export { requestFetchAllCategories, requestFetchSingleCategoryBySlug };
