"use client";

import { useState, useEffect } from "react";
import { Deal } from "../../../domain-models";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  Check,
  Copy,
  ExternalLink,
} from "lucide-react";

interface DealClientInteractionsProps {
  deal: Deal;
  store: any;
  isRTL: boolean;
  language: string;
}

export default function DealClientInteractions({
  deal,
  store,
  isRTL,
  language
}: DealClientInteractionsProps) {
  const [copied, setCopied] = useState(false);
  const [timeLeft, setTimeLeft] = useState('');
  const [savedDeals, setSavedDeals] = useState<Set<number | string>>(new Set());

  // Timer for deal expiration
  useEffect(() => {
    if (deal?.expires_at) {
      const timer = setInterval(() => {
        const now = new Date().getTime();
        const expiry = new Date(deal.expires_at!).getTime();
        const distance = expiry - now;

        if (distance < 0) {
          setTimeLeft(language === 'en' ? 'Expired' : 'منتهي');
          clearInterval(timer);
        } else {
          const days = Math.floor(distance / (1000 * 60 * 60 * 24));
          const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
          const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));

          if (days > 0) {
            setTimeLeft(language === 'en' ? `${days}d ${hours}h` : `${days} يوم ${hours} ساعة`);
          } else if (hours > 0) {
            setTimeLeft(language === 'en' ? `${hours}h ${minutes}m` : `${hours} ساعة ${minutes} دقيقة`);
          } else {
            setTimeLeft(language === 'en' ? `${minutes}m` : `${minutes} دقيقة`);
          }
        }
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [deal, language]);

  // Copy to clipboard helper
  const copyToClipboard = async (text: string): Promise<boolean> => {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(text);
        return true;
      } else {
        // Fallback for older browsers
        const textArea = document.createElement('textarea');
        textArea.value = text;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        textArea.style.top = '-999999px';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        const result = document.execCommand('copy');
        textArea.remove();
        return result;
      }
    } catch (error) {
      console.error('Failed to copy text:', error);
      return false;
    }
  };

  // Copy coupon code
  const copyCode = async () => {
    if (deal?.code) {
      const success = await copyToClipboard(deal.code);
      if (success) {
        setCopied(true);
        toast.success(isRTL ? 'تم نسخ الكود' : 'Code copied!');
        setTimeout(() => setCopied(false), 2000);
      } else {
        toast.error(isRTL ? 'فشل نسخ الكود' : 'Failed to copy code');
      }
    }
  };

  // Handle getting the deal
  const handleGetDeal = () => {
    const url = deal?.redirect_url || store?.redirect_url || store?.website_url;
    if (url) {
      window.open(url, '_blank', 'noopener,noreferrer');
    }
  };

  // Toggle save deal
  const toggleSave = (dealId: number | string) => {
    setSavedDeals(prev => {
      const newSet = new Set(prev);
      if (newSet.has(dealId)) {
        newSet.delete(dealId);
        toast.success(isRTL ? "تمت إزالة العرض من المحفوظات" : "Deal removed from saved");
      } else {
        newSet.add(dealId);
        toast.success(isRTL ? "تم حفظ العرض" : "Deal saved successfully");
      }
      return newSet;
    });
  };

  
  return (
    <>
      {/* Coupon Code */}
      {deal.code && (
        <div className="mb-6">
          <div className={`text-[#111827] mb-2 ${isRTL ? 'text-right' : 'text-left'}`} style={{ fontSize: '16px', fontWeight: 600 }}>
            {isRTL ? 'كود الكوبون:' : 'Coupon Code:'}
          </div>
          <div
            onClick={copyCode}
            className="bg-white border-2 border-[#111827] rounded-xl p-6 flex items-center justify-between cursor-pointer hover:bg-[#E8F3E8] transition-colors group"
          >
            <div className="text-[#111827]" style={{ fontSize: '24px', fontWeight: 700, letterSpacing: '2px' }}>
              {deal.code}
            </div>
            <Button
              onClick={(e) => {
                e.stopPropagation();
                copyCode();
              }}
              className="bg-[#5FB57A] hover:bg-[#4FA669] text-white border-2 border-[#111827] rounded-lg shadow-[2px_2px_0px_0px_rgba(17,24,39,1)] hover:shadow-[1px_1px_0px_0px_rgba(17,24,39,1)] hover:translate-x-[1px] hover:translate-y-[1px] transition-all"
            >
              {copied ? (
                <>
                  <Check className={`h-4 w-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
                  {isRTL ? 'تم النسخ' : 'Copied'}
                </>
              ) : (
                <>
                  <Copy className={`h-4 w-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
                  {isRTL ? 'نسخ' : 'Copy'}
                </>
              )}
            </Button>
          </div>
        </div>
      )}

      {/* Timer Display - Show before CTA */}
      {deal.expires_at && (
        <div className="bg-white rounded-2xl border-2 border-[#111827] shadow-[4px_4px_0px_0px_rgba(17,24,39,1)] p-6 mb-6">
          <div className={`flex items-center gap-3 mb-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <div className="h-6 w-6 text-[#F59E0B]">⏰</div>
            <div className="text-[#111827]" style={{ fontSize: '18px', fontWeight: 700 }}>
              {isRTL ? 'ينتهي خلال' : 'Expires in'}
            </div>
          </div>
          <div className="text-center bg-[#FEF3C7] border-2 border-[#F59E0B] rounded-xl p-4">
            <div className="text-[#F59E0B]" style={{ fontSize: '32px', fontWeight: 700 }}>
              {timeLeft || (isRTL ? 'حساب...' : 'Calculating...')}
            </div>
            <div className="text-[#92400E] text-sm">
              {new Date(deal.expires_at).toLocaleDateString(isRTL ? 'ar' : 'en', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </div>
          </div>
        </div>
      )}

      {/* CTA Button */}
      <Button
        onClick={handleGetDeal}
        className="w-full bg-[#5FB57A] hover:bg-[#4FA669] text-white border-2 border-[#111827] rounded-xl shadow-[4px_4px_0px_0px_rgba(17,24,39,1)] hover:shadow-[2px_2px_0px_0px_rgba(17,24,39,1)] hover:translate-x-[2px] hover:translate-y-[2px] transition-all py-6 mb-6"
        style={{ fontSize: '20px', fontWeight: 700 }}
      >
        <ExternalLink className={`h-6 w-6 ${isRTL ? 'ml-3' : 'mr-3'}`} />
        {isRTL ? 'احصل على العرض الآن' : 'Get This Deal Now'}
      </Button>
    </>
  );
}