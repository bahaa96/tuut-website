import { supabase } from "./instance";
import { Article } from "@/domain-models";

interface RequestFetchAllArticlesArgs {
  countrySlug: string;
  currentPage: number;
  pageSize: number;
}

const requestFetchAllArticles = async ({
  countrySlug,
  currentPage,
  pageSize,
}: RequestFetchAllArticlesArgs): Promise<{ data: Article[] }> => {
  const offset = (currentPage - 1) * pageSize;
  const { data, error } = await supabase
    .from("articles")
    .select("*")
    .eq("country_slug", countrySlug)
    .range(offset, offset + pageSize - 1);

  if (error) {
    throw new Error(error.message);
  }

  return { data };
};

export { requestFetchAllArticles };
