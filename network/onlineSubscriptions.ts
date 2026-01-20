import { supabase } from "./instance";
 import { OnlineSubscription, OnlineSubscriptionPrice, OnlineSubscriptionType, OnlineSubscriptionTypeDuration, SubscriptionOrder } from "@/domain-models";

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

interface RequestCreateSubscriptionOrderArgs {
  subscription_id: string;
  subscription_type_id: string;
  subscription_duration_id: string;
  customer_whatsapp: string;
  customer_email?: string;
  customer_name?: string;
  price: number;
  currency: string;
  country_slug: string;
  notes?: string;
}

const requestCreateSubscriptionOrder = async (
  orderData: RequestCreateSubscriptionOrderArgs
): Promise<{ data: SubscriptionOrder }> => {
  // order_number is now auto-generated by database sequence
  const { data, error } = await supabase
    .from("subscription_orders")
    .insert({
      ...orderData,
      status: 'pending',
      payment_status: 'pending',
    } as any)
    .select()
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return { data: data as SubscriptionOrder };
};

interface RequestFetchSubscriptionOrderArgs {
  orderId: string;
}

const requestFetchSubscriptionOrder = async ({
  orderId,
}: RequestFetchSubscriptionOrderArgs): Promise<{ data: SubscriptionOrder }> => {
  const { data, error } = await supabase
    .from("subscription_orders")
    .select("*")
    .eq("id", orderId)
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return { data };
};

interface RequestFetchSubscriptionOrderByNumberArgs {
  orderNumber: number;
}

const requestFetchSubscriptionOrderByNumber = async ({
  orderNumber,
}: RequestFetchSubscriptionOrderByNumberArgs): Promise<{ data: SubscriptionOrder }> => {
  const { data, error } = await supabase
    .from("subscription_orders")
    .select("*")
    .eq("order_number", orderNumber)
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return { data };
};

interface OrderDetails {
  order: SubscriptionOrder;
  subscription: OnlineSubscription;
  subscriptionType: OnlineSubscriptionType;
  subscriptionDuration: OnlineSubscriptionTypeDuration;
  subscriptionPrice: OnlineSubscriptionPrice;
}

interface RequestFetchOrderDetailsArgs {
  orderNumber: number;
}

const requestFetchOrderDetails = async ({
  orderNumber,  
}: RequestFetchOrderDetailsArgs): Promise<{ data: OrderDetails }> => {
  // Fetch the order
  const { data: order, error: orderError } = await supabase
    .from("subscription_orders")
    .select("*")
    .eq("order_number", orderNumber)
    .single();

  if (orderError) {
    throw new Error(orderError.message);
  }

  const orderTyped = order as SubscriptionOrder;

  // Fetch subscription details
  const { data: subscription, error: subscriptionError } = await supabase
    .from("online_subscriptions")
    .select("*")
    .eq("id", orderTyped.subscription_id)
    .single();

  if (subscriptionError) {
    throw new Error(subscriptionError.message);
  }

  // Fetch subscription type
  const { data: subscriptionType, error: typeError } = await supabase
    .from("subscription_types")
    .select("*")
    .eq("id", orderTyped.subscription_type_id)
    .single();

  if (typeError) {
    throw new Error(typeError.message);
  }

  // Fetch subscription duration
  const { data: subscriptionDuration, error: durationError } = await supabase
    .from("subscription_type_durations")
    .select("*")
    .eq("id", orderTyped.subscription_duration_id)
    .single();

  if (durationError) {
    throw new Error(durationError.message);
  }

  // Fetch subscription price
  const { data: subscriptionPrice, error: priceError } = await supabase
    .from("subscription_pricing")
    .select("*")
    .eq("duration_id", orderTyped.subscription_duration_id)
    .eq("country_slug", orderTyped.country_slug)
    .single();

  if (priceError) {
    throw new Error(priceError.message);
  }

  return {
    data: {
      order: orderTyped,
      subscription: subscription as OnlineSubscription,
      subscriptionType: subscriptionType as OnlineSubscriptionType,
      subscriptionDuration: subscriptionDuration as OnlineSubscriptionTypeDuration,
      subscriptionPrice: subscriptionPrice as OnlineSubscriptionPrice,
    },
  };
};

export type { OrderDetails };

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
    requestCreateSubscriptionOrder,
    requestFetchSubscriptionOrder,
    requestFetchSubscriptionOrderByNumber,
    requestFetchOrderDetails,
};

