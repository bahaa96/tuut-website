# Plans Section Markup

This file contains the extracted markup for the "Plans Section" from the subscription detail page that can be added to the subscription card in the subscriptions listing page.

## Plans Section (Main Section)

```tsx
{/* Plans Section */}
<section className="py-8 md:py-12">
  <div className="container mx-auto max-w-[1200px] px-4">
    <h2 className={`text-2xl md:text-3xl font-bold text-[#111827] mb-6 ${isRTL ? 'text-right' : ''}`}>
      {locale === "en" ? "Choose Your Plan" : "اختر خطتك"}
    </h2>

    {plans.length === 0 ? (
      <div className="bg-white border-2 border-[#111827] rounded-xl p-12 text-center">
        <Sparkles className="h-16 w-16 text-[#5FB57A] mx-auto mb-4" />
        <h3 className="text-xl font-bold text-[#111827] mb-2">
          {locale === "en" ? "No Plans Available" : "لا توجد خطط متاحة"}
        </h3>
        <p className="text-[#6B7280] mb-6">
          {locale === "en"
            ? "Plans for this service are not available in your country yet."
            : "الخطط لهذه الخدمة غير متاحة في بلدك حالياً."}
        </p>
        {subscription.service_url && (
          <Button
            onClick={() => window.open(subscription.service_url, "_blank")}
            className="bg-[#5FB57A] hover:bg-[#4FA569] text-white border-2 border-[#111827] rounded-xl shadow-[3px_3px_0px_0px_rgba(17,24,39,1)] hover:shadow-[1px_1px_0px_0px_rgba(17,24,39,1)] transition-all"
            style={{ fontWeight: 600 }}
          >
            {locale === "en" ? "Visit Official Website" : "زيارة الموقع الرسمي"}
            <ExternalLink className={`h-4 w-4 ${isRTL ? 'mr-2' : 'ml-2'}`} />
          </Button>
        )}
      </div>
    ) : (
      <>
        {/* Duration Filter */}
        {durations.length > 1 && (
          <div className="mb-8">
            <div className={`flex flex-wrap gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
              <Button
                variant={selectedDuration === "all" ? "default" : "outline"}
                onClick={() => setSelectedDuration("all")}
                className={`border-2 border-[#111827] rounded-xl ${
                  selectedDuration === "all"
                    ? "bg-[#5FB57A] text-white hover:bg-[#4FA569]"
                    : "hover:bg-[#E8F3E8]"
                }`}
              >
                {locale === "en" ? "All Durations" : "كل المدد"}
              </Button>
              {durations.sort((a, b) => (a || 0) - (b || 0)).map((duration) => (
                <Button
                  key={duration}
                  variant={selectedDuration === duration ? "default" : "outline"}
                  onClick={() => setSelectedDuration(duration || "all")}
                  className={`border-2 border-[#111827] rounded-xl ${
                    selectedDuration === duration
                      ? "bg-[#5FB57A] text-white hover:bg-[#4FA569]"
                      : "hover:bg-[#E8F3E8]"
                  }`}
                >
                  {duration} {locale === "en" ? "Months" : "شهر"}
                </Button>
              ))}
            </div>
          </div>
        )}

        {/* Plans Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPlans.map((plan) => (
            <PlanCard
              key={`${plan.typeId}-${plan.durationId}`}
              plan={plan}
              locale={locale}
              isRTL={isRTL}
              onGetPlan={handleGetPlan}
            />
          ))}
        </div>
      </>
    )}
  </div>
</section>
```

## PlanCard Component

```tsx
// Plan Card Component
interface PlanCardProps {
  plan: PlanDisplay;
  locale: string;
  isRTL: boolean;
  onGetPlan: (plan: PlanDisplay) => void;
}

function PlanCard({ plan, locale, isRTL, onGetPlan }: PlanCardProps) {
  const planType = locale === "ar" ? plan.typeNameAr : plan.typeName;
  const durationLabel = locale === "ar" ? plan.durationLabelAr : plan.durationLabel;

  const isRecommended = plan.isRecommended || plan.isPopular;

  return (
    <div
      className={`bg-white border-2 border-[#111827] rounded-xl p-6 hover:shadow-[4px_4px_0px_0px_rgba(17,24,39,1)] transition-all relative ${
        isRecommended ? "ring-4 ring-[#5FB57A] ring-offset-2" : ""
      }`}
    >
      {isRecommended && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2">
          <Badge className="bg-[#5FB57A] text-white border-2 border-[#111827] hover:bg-[#4FA569] px-4 py-1">
            <Crown className="h-3 w-3 mr-1" />
            {locale === "en" ? "Recommended" : "موصى به"}
          </Badge>
        </div>
      )}

      {planType && (
        <h3 className={`text-xl font-bold text-[#111827] mb-2 mt-2 ${isRTL ? 'text-right' : ''}`}>
          {planType}
        </h3>
      )}

      <div className={`flex items-center gap-2 text-[#6B7280] mb-6 ${isRTL ? 'flex-row-reverse' : ''}`}>
        <Clock className="h-4 w-4" />
        <span>
          {durationLabel || `${plan.durationMonths} ${locale === "en" ? "Months" : "شهر"}`}
        </span>
      </div>

      <div className={`mb-6 ${isRTL ? 'text-right' : ''}`}>
        <div className={`flex items-baseline gap-2 mb-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
          <span className="text-3xl font-bold text-[#111827]">
            {plan.currency || "$"}{plan.discountedPrice}
          </span>
          {plan.originalPrice && plan.originalPrice > (plan.discountedPrice || 0) && (
            <span className="text-lg text-[#6B7280] line-through">
              {plan.currency || "$"}{plan.originalPrice}
            </span>
          )}
        </div>
        {plan.savingsPercentage && plan.savingsPercentage > 0 && (
          <p className="text-sm text-[#5FB57A] font-semibold">
            {locale === "en" ? "Save" : "وفر"} {plan.savingsPercentage}%
          </p>
        )}
      </div>

      <Button
        onClick={() => onGetPlan(plan)}
        className={`w-full border-2 border-[#111827] rounded-xl shadow-[3px_3px_0px_0px_rgba(17,24,39,1)] hover:shadow-[1px_1px_0px_0px_rgba(17,24,39,1)] transition-all ${
          isRecommended
            ? "bg-[#5FB57A] hover:bg-[#4FA569] text-white"
            : "bg-white hover:bg-[#E8F3E8] text-[#111827]"
        }`}
        style={{ fontWeight: 600 }}
      >
        {locale === "en" ? "Get This Plan" : "احصل على هذه الخطة"}
        <ExternalLink className={`h-4 w-4 ${isRTL ? "mr-2" : "ml-2"}`} />
      </Button>
    </div>
  );
}
```

## Required Imports

```tsx
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Sparkles,
  ExternalLink,
  Clock,
  Crown,
} from "lucide-react";
```

## Required Types/Interfaces

```tsx
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
```

## Required State Variables

```tsx
const [plans, setPlans] = useState<PlanDisplay[]>([]);
const [selectedDuration, setSelectedDuration] = useState<number | "all">("all");

// Get unique durations
const durations = Array.from(new Set(plans.map((p) => p.durationMonths).filter(Boolean)));

// Filter plans by duration
const filteredPlans = selectedDuration === "all" 
  ? plans 
  : plans.filter(p => p.durationMonths === selectedDuration);
```

## Required Handler Function

```tsx
const handleGetPlan = (plan: PlanDisplay) => {
  const planName = locale === "ar" ? plan.typeNameAr : plan.typeName;
  const durationLabel = locale === "ar" ? plan.durationLabelAr : plan.durationLabel;
  const fullPlanName = `${planName} - ${durationLabel || `${plan.durationMonths} ${locale === "en" ? "Months" : "شهر"}`}`;
  const planPrice = `${plan.currency || "$"}${plan.discountedPrice}`;
  
  router.push(
    `/${localeCountry}/subscription-checkout?plan=${encodeURIComponent(fullPlanName)}&price=${encodeURIComponent(planPrice)}&service=${encodeURIComponent(title || "")}`
  );
};
```
