"use client";

import { DealCard } from "../../../../components/DealCard";

interface RelatedDealsSectionProps {
  deals: any[];
  isRTL: boolean;
}

export default function RelatedDealsSection({ deals, isRTL }: RelatedDealsSectionProps) {
  const handleToggleSave = (dealId: number) => {
    // TODO: Implement save functionality
    console.log("Toggle save for deal:", dealId);
  };

  return (
    <div className="grid sm:grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-6">
      {deals.map((deal) => (
        <DealCard
          key={deal.id}
          deal={deal}
          isRTL={isRTL}
          isSaved={false}
          onToggleSave={handleToggleSave}
        />
      ))}
    </div>
  );
}