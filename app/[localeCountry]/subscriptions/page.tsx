"use client";

import { useEffect, useState} from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { ImageWithFallback } from "@/components/figma/ImageWithFallback";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sparkles,
  Search,
  Clock,
  Users,
  CheckCircle2,
  ExternalLink,
  TrendingUp,
  Crown,
} from "lucide-react";
import { setLocale, getLocale } from "@/src/paraglide/runtime";
import { requestFetchAllOnlineSubscriptions, requestFetchSingleOnlineSubscriptionsPrice, requestFetchSingleOnlineSubscriptionTypeDurations, requestFetchSingleOnlineSubscriptionTypes } from "@/network";
import { OnlineSubscription, OnlineSubscriptionPrice, OnlineSubscriptionType, OnlineSubscriptionTypeDuration } from "@/domain-models";


interface PlanDisplay {
  typeId: number;
  typeName: string;
  typeNameAr: string;
  maxUsers?: number;
  isRecommended?: boolean;
  durationId: number;
  durationMonths: number;
  durationLabel?: string;
  durationLabelAr?: string;
  isPopular?: boolean;
  originalPrice?: number;
  discountedPrice?: number;
  currency?: string;
  savingsPercentage?: number;
}

export default function SubscriptionsPage() {
  const params = useParams();
  const router = useRouter();
  const localeCountry = params.localeCountry as string;
  const countrySlug = localeCountry.split("-")[1];
  const locale = localeCountry?.split("-")[0] || "en";
  const isRTL = locale === "ar";
  
  setLocale(locale as "ar" | "en");
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("popular");
  const [categories, setCategories] = useState<string[]>([]);
  const [subscriptions, setSubscriptions] = useState<OnlineSubscription[]>([]);
  const [subscriptionDurations, setSubscriptionDurations] = useState<OnlineSubscriptionTypeDuration[]>([]);
  const [subscriptionTypes, setSubscriptionTypes] = useState<OnlineSubscriptionType[]>([]);
  const [subscriptionPricing, setSubscriptionPricing] = useState<OnlineSubscriptionPrice[]>([]);

  const handleGetSubscription = (subscription: OnlineSubscription) => {
    const slug = locale === "ar" ? subscription.slug_ar : subscription.slug_en;
    if (!slug) {
      console.error("Subscription slug not found for locale:", locale);
      return;
    }
    router.push(`/${localeCountry}/subscription/${slug}`);
  };

  const isLoading = false;

  useEffect(() => {
    const fetchSubscriptions = async () => {
      const { data: subscriptions } = await requestFetchAllOnlineSubscriptions({
        searchText: searchQuery,
        currentPage: 1,
        pageSize: 10,
      });
      setSubscriptions(subscriptions);
      
        await fetchPlansForSubscriptions(subscriptions);
    };
    fetchSubscriptions();
  }, [countrySlug]);

  const fetchPlansForSubscriptions = async (subs: OnlineSubscription[]) => {
    
    console.log("subs",subs);

    for (const sub of subs) {
      try {        
        const { data: typesData } = await requestFetchSingleOnlineSubscriptionTypes({
          subscriptionId: sub.id,
        });

        setSubscriptionTypes(typesData);

        console.log("typesData",typesData);



        const { data: durationsData } = await requestFetchSingleOnlineSubscriptionTypeDurations({
          typeId: typesData[0].id,
        });

        setSubscriptionDurations(durationsData);

        console.log("durationsData",durationsData);

        // Fetch pricing for all durations filtered by country
        const { data: pricingData } = await requestFetchSingleOnlineSubscriptionsPrice({
          durationId: durationsData[0].id,
          countrySlug: countrySlug,
        });

        setSubscriptionPricing([pricingData]);

      } catch (error) {
        console.error(`Error fetching plans for subscription ${sub.id}:`, error);
      }
    }

  };

  return (
    <div className={`min-h-screen bg-[#E8F3E8] ${isRTL ? "rtl" : "ltr"}`}>
      {/* Hero Section */}
      <section className="relative bg-white border-b-2 border-[#111827]">
        <div className="container mx-auto max-w-[1200px] px-4 py-12 md:py-16">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 bg-[#E8F3E8] px-4 py-2 rounded-full border-2 border-[#111827] mb-6">
              <Sparkles className="h-5 w-5 text-[#5FB57A]" />
              <span className="text-sm font-semibold text-[#111827]">
                {locale === "en" ? "Premium Services at Discounted Prices" : "خدمات مميزة بأسعار مخفضة"}
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-[#111827] mb-4">
              {locale === "en" ? "Online Subscriptions" : "الاشتراكات الإلكترونية"}
            </h1>
            <p className="text-lg text-[#6B7280] max-w-2xl mx-auto">
              {locale === "en"
                ? "Get exclusive access to premium online services like Perplexity Pro, Canva Pro, and Notion at amazing discounted rates."
                : "احصل على وصول حصري للخدمات المميزة مثل Perplexity Pro و Canva Pro و Notion بأسعار مخفضة مذهلة."}
            </p>
          </div>
        </div>
      </section>

      {/* Filters Section */}
      <section className="bg-white border-b-2 border-[#111827]">
        <div className="container mx-auto max-w-[1200px] px-4 py-6">
          <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center">
            {/* Search */}
            <div className="relative flex-1">
              <Search className={`absolute top-1/2 -translate-y-1/2 h-5 w-5 text-[#6B7280] ${isRTL ? 'right-3' : 'left-3'}`} />
              <Input
                type="text"
                placeholder={locale === "en" ? "Search subscriptions..." : "ابحث عن الاشتراكات..."}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`h-11 border-2 border-[#111827] rounded-xl ${isRTL ? 'pr-10 text-right' : 'pl-10'}`}
              />
            </div>

            {/* Category Filter */}
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-full md:w-[200px] h-11 border-2 border-[#111827] rounded-xl">
                <SelectValue placeholder={locale === "en" ? "All Categories" : "كل الفئات"} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">
                  {locale === "en" ? "All Categories" : "كل الفئات"}
                </SelectItem>
                {categories.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Sort */}
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-full md:w-[200px] h-11 border-2 border-[#111827] rounded-xl">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="popular">
                  {locale === "en" ? "Most Popular" : "الأكثر شعبية"}
                </SelectItem>
                <SelectItem value="price-low">
                  {locale === "en" ? "Price: Low to High" : "السعر: من الأقل للأعلى"}
                </SelectItem>
                <SelectItem value="price-high">
                  {locale === "en" ? "Price: High to Low" : "السعر: من الأعلى للأقل"}
                </SelectItem>
                <SelectItem value="savings">
                  {locale === "en" ? "Best Savings" : "أفضل توفير"}
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </section>

      {/* Subscriptions Grid */}
      <section className="py-8 md:py-12">
        <div className="container mx-auto max-w-[1200px] px-4">
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-white border-2 border-[#111827] rounded-xl p-6">
                  <Skeleton className="h-16 w-16 rounded-lg mb-4" />
                  <Skeleton className="h-6 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-full mb-4" />
                  <Skeleton className="h-10 w-full" />
                </div>
              ))}
            </div>
          ) : subscriptions.length === 0 ? (
            <div className="text-center py-16">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-[#E8F3E8] rounded-full border-2 border-[#111827] mb-4">
                <Search className="h-8 w-8 text-[#5FB57A]" />
              </div>
              <h3 className="text-xl font-semibold text-[#111827] mb-2">
                {locale === "en" ? "No subscriptions found" : "لم يتم العثور على اشتراكات"}
              </h3>
              <p className="text-[#6B7280]">
                {locale === "en"
                  ? "Try adjusting your search or filters"
                  : "حاول تعديل البحث أو الفلاتر"}
              </p>
            </div>
          ) : (
            <>
              {/* Results Count */}
              <div className="mb-6">
                <p className="text-[#6B7280]">
                  {locale === "en"
                    ? `Showing ${subscriptions.length} subscription${subscriptions.length !== 1 ? 's' : ''}`
                    : `عرض ${subscriptions.length} اشتراك${subscriptions.length !== 1 ? 'ات' : ''}`}
                </p>
              </div>

              {/* Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {subscriptions.map((subscription) => {
                  const name = locale === "ar" ? subscription.title_ar : subscription.title_en;
                  const desc = locale === "ar" ? subscription.description_ar : subscription.description_en;

                  return (
                    <div
                      key={subscription.id}
                      onClick={() => handleGetSubscription(subscription)}
                      className="bg-white border-2 border-[#111827] rounded-xl p-6 hover:shadow-[4px_4px_0px_0px_rgba(17,24,39,1)] transition-all group h-fit cursor-pointer"
                    >
                      {/* Header */}
                      <div className={`flex items-start gap-4 mb-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
                        {subscription.image_url_en ? (
                          <ImageWithFallback
                            src={subscription.image_url_en}
                            alt={name || ""}
                            className="w-16 h-16 object-contain rounded-lg border-2 border-[#111827] bg-white  overflow-hidden"
                          />
                        ) : (
                          <div className="w-16 h-16 bg-[#E8F3E8] rounded-lg border-2 border-[#111827] flex items-center justify-center">
                            <Sparkles className="h-8 w-8 text-[#5FB57A]" />
                          </div>
                        )}
                        <div className="flex-1">
                          <div className={`flex items-start justify-between gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                            <h3 className="font-semibold text-[#111827] text-lg leading-tight">
                              {name}
                            </h3>
                          </div>
                        </div>
                      </div>

                      {/* Description */}
                      {desc && (
                        <p className={`text-sm text-[#6B7280] mb-4 line-clamp-2 ${isRTL ? 'text-right' : ''}`}>
                          {desc}
                        </p>
                      )}


                        <div className="mb-4">
                          <h4 className={`text-sm font-semibold text-[#111827] mb-3 ${isRTL ? 'text-right' : ''}`}>
                            {locale === "en" ? "Available Plans:" : "الخطط المتاحة:"}
                          </h4>
                          <div className="space-y-3">
                            {/* Group by type */}
                            <SubscriptionTypes subscriptionId={subscription.id} countrySlug={countrySlug} />
                          </div>
                        </div>



                      {/* Action Button */}
                      <Button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleGetSubscription(subscription);
                        }}
                        className="w-full bg-[#5FB57A] hover:bg-[#4FA569] text-white border-2 border-[#111827] rounded-xl shadow-[3px_3px_0px_0px_rgba(17,24,39,1)] hover:shadow-[1px_1px_0px_0px_rgba(17,24,39,1)] transition-all"
                        style={{ fontWeight: 600 }}
                      >
                        {locale === "en" ? "Get Subscription" : "احصل على الاشتراك"}
                        <ExternalLink className={`h-4 w-4 ${isRTL ? 'mr-2' : 'ml-2'}`} />
                      </Button>

                      
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 md:py-16 bg-white border-t-2 border-[#111827]">
        <div className="container mx-auto max-w-[1200px] px-4">
          <div className="bg-[#5FB57A] border-2 border-[#111827] rounded-xl p-8 md:p-12 text-center">
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
              {locale === "en"
                ? "Can't find what you're looking for?"
                : "لم تجد ما تبحث عنه؟"}
            </h2>
            <p className="text-white/90 mb-6 max-w-2xl mx-auto">
              {locale === "en"
                ? "Contact us and let us know which subscription service you'd like to see, and we'll do our best to add it."
                : "تواصل معنا وأخبرنا عن الاشتراك الذي تبحث عنه، وسنبذل قصارى جهدنا لإضافته."}
            </p>
            <Button
              className="bg-white text-[#5FB57A] hover:bg-gray-100 border-2 border-[#111827] rounded-xl shadow-[3px_3px_0px_0px_rgba(17,24,39,1)] hover:shadow-[1px_1px_0px_0px_rgba(17,24,39,1)] transition-all"
              style={{ fontWeight: 600 }}
            >
              {locale === "en" ? "Contact Us" : "تواصل معنا"}
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}


const SubscriptionTypes = ({ subscriptionId, countrySlug }: { subscriptionId: number, countrySlug: string }) => {
  const locale = getLocale();
  const [subscriptionTypes, setSubscriptionTypes] = useState<OnlineSubscriptionType[]>([]);

  useEffect(() => {
  try {        
    const fetchSubscriptionTypes = async () => {
      const { data: typesData } = await requestFetchSingleOnlineSubscriptionTypes({
        subscriptionId: subscriptionId,
      });
      setSubscriptionTypes(typesData);
    }
    fetchSubscriptionTypes();
  } catch (error) {
    console.error(`Error fetching types for subscription ${subscriptionId}:`, error);
  }
  }, [subscriptionId]);

  return subscriptionTypes.map((type: OnlineSubscriptionType) => (
    <div key={type.id} className="bg-[#E8F3E8]/50 rounded-lg p-3 border border-[#5FB57A]/20">
      <p className={`text-xs font-semibold text-[#5FB57A] mb-2 ${locale === "ar" ? 'text-right' : ''}`}>
        {locale === "ar" ? type.name_ar : type.name_en}
      </p>
      <div className="space-y-2">
        <SubscriptionTypeDurations subscriptionTypeId={type.id} countrySlug={countrySlug} />
      </div>
    </div>
  ));
};


const SubscriptionTypeDurations = ({ subscriptionTypeId, countrySlug }: { subscriptionTypeId: number, countrySlug: string }) => { 
  const locale = getLocale();
  const isRTL = locale === "ar";
  const [subscriptionDurations, setSubscriptionDurations] = useState<OnlineSubscriptionTypeDuration[]>([]);

  useEffect(() => {
    try {
      const fetchSubscriptionDurations = async () => {
        const { data: durationsData } = await requestFetchSingleOnlineSubscriptionTypeDurations({
          typeId: subscriptionTypeId,
        });
        setSubscriptionDurations(durationsData);
      }
      fetchSubscriptionDurations();
    } catch (error) {
      console.error(`Error fetching durations for subscription type ${subscriptionTypeId}:`, error);
    }
  }, [subscriptionTypeId]);

  return subscriptionDurations.map((duration: OnlineSubscriptionTypeDuration) => {

    return (
      <div 
        key={duration.id} 
        className={`flex items-center justify-between text-xs ${isRTL ? 'flex-row-reverse' : ''}`}
      >
        <div className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
          <Clock className="h-3 w-3 text-[#6B7280]" />
          <span className="text-[#6B7280]">{duration.duration_value} {duration.duration_type }</span>
          {duration?.is_popular && (
            <Badge className="bg-[#5FB57A] text-white text-[10px] px-1.5 py-0 h-4">
              {locale === "en" ? "Popular" : "رائج"}
            </Badge>
          )}
        </div>
        <SubscriptionTypePrice durationId={duration.id} countrySlug={countrySlug} />
      </div>
    );
  })
};  

const SubscriptionTypePrice = ({ durationId, countrySlug }: { durationId: number, countrySlug: string }) => {
  const locale = getLocale();
  const [subscriptionPrice, setSubscriptionPrice] = useState<OnlineSubscriptionPrice[]>([]);
  const isRTL = locale === "ar";


  useEffect(() => {
    try {
      const fetchSubscriptionPrice = async () => {
        const { data: priceData } = await requestFetchSingleOnlineSubscriptionsPrice({
          durationId: durationId, 
          countrySlug: countrySlug,
        });
        setSubscriptionPrice(priceData);
      }
      fetchSubscriptionPrice();
    } catch (error) {
      console.error(`Error fetching price for duration ${durationId}:`, error);
    }
  }, [durationId]);

  return subscriptionPrice.map((price: OnlineSubscriptionPrice) => (
    <div className={`flex items-center gap-1.5 ${isRTL ? 'flex-row-reverse' : ''}`}>
    <span className="font-bold text-[#111827]">
      {price.currency || "$"}{price.price}
    </span>
    {price?.original_price && price.original_price > (price.discounted_price || 0) && (
      <span className="text-[10px] text-[#6B7280] line-through">
        {price.currency || "$"}{price.original_price}
      </span>
    )}
  </div>
  ));
};  
