import { supabase } from "./instance";
 import { OnlineSubscription, OnlineSubscriptionPrice, OnlineSubscriptionType, OnlineSubscriptionTypeDuration } from "@/domain-models";

interface requestFetchSingleOnlineSubscriptionPriceArgs {
  durationId: string;
  countrySlug: string;
}

const requestFetchSingleOnlineSubscriptionPrice = async ({
  durationId,
  countrySlug,
}: requestFetchSingleOnlineSubscriptionPriceArgs): Promise<{ data: OnlineSubscriptionPrice }> => {
  const { data, error } = await supabase
    .from("subscription_pricing")
    .select("*")
    .eq("duration_id", durationId)
    .eq("country_slug", countrySlug)
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return { data };
};

interface RequestFetchSingleOnlineSubscriptionTypesArgs {
  subscriptionId: string;
}

const requestFetchSingleOnlineSubscriptionTypes = async ({
  subscriptionId,
}: RequestFetchSingleOnlineSubscriptionTypesArgs): Promise<{ data: OnlineSubscriptionType[] }> => {
  const { data, error } = await supabase
    .from("subscription_types")
    .select("*")
    .eq("subscription_id", subscriptionId);

  if (error) {
    throw new Error(error.message);
  }

  return { data };
};

interface RequestFetchSingleOnlineSubscriptionTypeDurationsArgs {
  typeId: string;
}

const requestFetchSingleOnlineSubscriptionTypeDurations = async ({
  typeId,
}: RequestFetchSingleOnlineSubscriptionTypeDurationsArgs): Promise<{ data: OnlineSubscriptionTypeDuration[] }> => {
  const { data, error } = await supabase
    .from("subscription_type_durations")
    .select("*")
    .eq("type_id", typeId);

    if (error) {
        throw new Error(error.message);
      }
    
      return { data };  
};

interface RequestFetchAllOnlineSubscriptionsArgs {
    searchText?: string;
    currentPage: number;
    pageSize: number;
    options?: {
        abortSignal?: AbortSignal;
    };
}

const requestFetchAllOnlineSubscriptions = async ({
  searchText,
  currentPage,
  pageSize,
  options,
}: RequestFetchAllOnlineSubscriptionsArgs): Promise<{ data: OnlineSubscription[] }> => {
  const offset = (currentPage - 1) * pageSize;
  let query = supabase
    .from("online_subscriptions")
    .select("*")
    .range(offset, offset + pageSize - 1);

  if (searchText) {
    query = query.textSearch("title_en || title_ar", searchText);
  }

  const { data, error } = await query.select();

  if (error) {
    throw new Error(error.message);
  }

  return { data };
}

interface RequestFetchSingleOnlineSubscriptionArgs {
  subscriptionSlug: string;
}

const requestFetchSingleOnlineSubscription = async ({
  subscriptionSlug,
}: RequestFetchSingleOnlineSubscriptionArgs): Promise<{ data: OnlineSubscription }> => {
  const decodedSlug = decodeURIComponent(subscriptionSlug);
  const { data, error } = await supabase
    .from("online_subscriptions")
    .select("*")
    .or(`slug_en.eq.${decodedSlug},slug_ar.eq.${decodedSlug}`)
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return { data };
}

interface RequestFetchRelatedOnlineSubscriptionsArgs {
  subscriptionSlug: string;
}

const requestFetchRelatedOnlineSubscriptions = async ({
  subscriptionSlug,
}: RequestFetchRelatedOnlineSubscriptionsArgs): Promise<{ data: OnlineSubscription[] }> => {
  const decodedSlug = decodeURIComponent(subscriptionSlug);
  const { data, error } = await supabase
    .from("online_subscriptions")
    .select("*")
    .or(`slug_en.neq.${decodedSlug},slug_ar.neq.${decodedSlug}`)
    .limit(3);

  if (error) {
    throw new Error(error.message);
  }

  return { data };
}

interface RequestFetchSingleOnlineSubscriptionDurationArgs {
  subscriptionDurationId: string;
}

const requestFetchSingleOnlineSubscriptionDuration = async ({
  subscriptionDurationId,
}: RequestFetchSingleOnlineSubscriptionDurationArgs): Promise<{ data: OnlineSubscriptionTypeDuration }> => {
  const { data, error } = await supabase
    .from("subscription_type_durations")
    .select("*")
    .eq("id", subscriptionDurationId)
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return { data };
} 

interface RequestFetchSingleOnlineSubscriptionTypeArgs {
  subscriptionTypeId: string;
}

const requestFetchSingleOnlineSubscriptionType = async ({
  subscriptionTypeId,
}: RequestFetchSingleOnlineSubscriptionTypeArgs): Promise<{ data: OnlineSubscriptionType }> => {
  const { data, error } = await supabase
    .from("subscription_types")
    .select("*")
    .eq("id", subscriptionTypeId)
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return { data };
}

interface RequestFetchSingleOnlineSubscriptionByIdArgs {
  subscriptionId: string;
}

const requestFetchSingleOnlineSubscriptionById = async ({
  subscriptionId,
}: RequestFetchSingleOnlineSubscriptionByIdArgs): Promise<{ data: OnlineSubscription }> => {
  const { data, error } = await supabase
    .from("online_subscriptions")
    .select("*")
    .eq("id", subscriptionId)
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return { data };
}

export { 
    requestFetchSingleOnlineSubscriptionPrice,
    requestFetchSingleOnlineSubscriptionTypes,
    requestFetchSingleOnlineSubscriptionTypeDurations,
    requestFetchAllOnlineSubscriptions,
    requestFetchSingleOnlineSubscription,
    requestFetchRelatedOnlineSubscriptions,
    requestFetchSingleOnlineSubscriptionDuration,
    requestFetchSingleOnlineSubscriptionType,
    requestFetchSingleOnlineSubscriptionById,
};

