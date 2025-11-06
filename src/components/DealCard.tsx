import { useState } from "react";
import { Heart, Copy } from "lucide-react";
import { Button } from "./ui/button";
import { toast } from "sonner@2.0.3";
import { Link } from "../router";

interface DealCardProps {
  deal: {
    id: number;
    title?: string;
    title_ar?: string;
    description?: string;
    description_ar?: string;
    discount_percentage?: number;
    discount_amount?: number;
    original_price?: number;
    discounted_price?: number;
    code?: string;
    store_id?: string;
    store_slug?: string;
    store_name?: string;
    store_logo?: string;
    category_name?: string;
    expires_at?: string;
    is_verified?: boolean;
    featured?: boolean;
  };
  isRTL: boolean;
  isSaved: boolean;
  onToggleSave: (id: number) => void;
}

export function DealCard({ deal, isRTL, isSaved, onToggleSave }: DealCardProps) {
  const title = isRTL && deal.title_ar ? deal.title_ar : deal.title;
  const description = isRTL && deal.description_ar ? deal.description_ar : deal.description;

  const copyCouponCode = (code: string) => {
    navigator.clipboard.writeText(code);
    toast.success(isRTL ? "تم نسخ كود الخصم" : "Coupon code copied!");
  };

  // Assign color based on deal ID for variety
  const colors = ['#7EC89A', '#5FB57A', '#9DD9B3', '#BCF0CC'];
  const color = colors[deal.id % colors.length];

  return (
    <div className="group relative bg-white rounded-2xl overflow-hidden border-2 border-[#111827] shadow-[4px_4px_0px_0px_rgba(17,24,39,1)] hover:shadow-[2px_2px_0px_0px_rgba(17,24,39,1)] transition-all">
      {/* Left/Right Discount Bar with Perforated Edge */}
      <div 
        className={`absolute ${isRTL ? 'right-0' : 'left-0'} top-0 bottom-0 w-[100px] flex items-center justify-center`} 
        style={{ backgroundColor: color }}
      >
        {/* Perforated circles on edge */}
        <div className={`absolute ${isRTL ? 'left-0' : 'right-0'} top-0 bottom-0 w-2 flex flex-col justify-around`}>
          {[...Array(12)].map((_, i) => (
            <div key={i} className={`w-3 h-3 bg-white rounded-full ${isRTL ? '-ml-1.5' : '-mr-1.5'}`} />
          ))}
        </div>
        
        {/* Vertical DISCOUNT text */}
        <div
          className="text-[#111827] tracking-[0.3em]"
          style={{
            writingMode: 'vertical-rl',
            textOrientation: 'mixed',
            fontSize: '18px',
            fontWeight: 700,
            transform: 'rotate(180deg)',
          }}
        >
          {deal.discount_percentage ? `${deal.discount_percentage}%` : isRTL ? 'خصم' : 'DEAL'}
        </div>
      </div>

      {/* Main Content Area */}
      <div className={`${isRTL ? 'mr-[100px]' : 'ml-[100px]'} p-6 relative`}>
        {/* Heart Icon */}
        <button
          onClick={() => onToggleSave(deal.id)}
          className={`absolute top-4 ${isRTL ? 'left-4' : 'right-4'} p-2 rounded-full hover:bg-[#F0F7F0] transition-colors`}
        >
          <Heart
            className={`h-5 w-5 transition-colors ${
              isSaved
                ? "fill-[#EF4444] text-[#EF4444]"
                : "text-[#9CA3AF]"
            }`}
          />
        </button>

        {/* Content */}
        <div className={`${isRTL ? 'pl-8' : 'pr-8'}`}>
          {/* Store Logo */}
          {deal.store_logo && (
            <div className="mb-3">
              <img
                src={deal.store_logo}
                alt={deal.store_name}
                className="h-8 object-contain"
              />
            </div>
          )}

          {/* Title */}
          <h3 
            className="mb-3 text-[#111827]" 
            style={{ fontSize: '20px', fontWeight: 600 }}
            dir={isRTL ? 'rtl' : 'ltr'}
          >
            {title}
          </h3>
          
          {/* Coupon Code Display */}
          {deal.code && (
            <div className="mb-4">
              <div 
                className="text-[#111827] tracking-wide mb-3"
                style={{ fontSize: '24px', fontWeight: 700 }}
              >
                {deal.code}
              </div>
            </div>
          )}

          {/* Description */}
          {description && (
            <p className="text-[#6B7280] text-sm mb-2" dir={isRTL ? 'rtl' : 'ltr'}>
              {description}
            </p>
          )}

          {/* Store & Category - Terms link style */}
          {(deal.store_name || deal.category_name) && (
            <div className="text-sm inline-block mb-6">
              {deal.store_name && deal.store_slug && (
                <Link 
                  to={`/store/${deal.store_slug}`}
                  className="text-[#5FB57A] hover:underline"
                >
                  {deal.store_name}
                </Link>
              )}
              {deal.store_name && !deal.store_slug && (
                <span className="text-[#5FB57A]">{deal.store_name}</span>
              )}
              {deal.category_name && deal.store_name && <span className="text-[#6B7280]"> • </span>}
              {deal.category_name && <span className="text-[#5FB57A]">{deal.category_name}</span>}
            </div>
          )}
        </div>

        {/* Apply Code Button - Always show */}
        <Button
          onClick={() => deal.code && copyCouponCode(deal.code)}
          className="w-full bg-white text-[#111827] border-2 border-[#111827] hover:bg-[#F0F7F0] rounded-xl"
          style={{ fontWeight: 600 }}
        >
          <Copy className={`h-4 w-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
          {deal.code 
            ? (isRTL ? 'نسخ الكود' : 'Copy Code')
            : (isRTL ? 'الحصول على العرض' : 'Get Deal')
          }
        </Button>
      </div>
    </div>
  );
}
