"use client";

import { useState, useEffect } from "react";
import { Deal } from "../../../../domain-models";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  Check,
  Share2,
  Facebook,
  Twitter,
  Linkedin,
  MessageCircle,
  LinkIcon,
} from "lucide-react";

interface DealSidebarProps {
  deal: Deal;
  store: any;
  isRTL: boolean;
  language: string;
}

export default function DealSidebar({
  deal,
  store,
  isRTL,
  language
}: DealSidebarProps) {
  const [linkCopied, setLinkCopied] = useState(false);

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

  // Copy deal link
  const copyDealLink = async () => {
    const url = window.location.href;
    const success = await copyToClipboard(url);
    if (success) {
      setLinkCopied(true);
      toast.success(isRTL ? 'تم نسخ الرابط' : 'Link copied!');
      setTimeout(() => setLinkCopied(false), 2000);
    } else {
      toast.error(isRTL ? 'فشل نسخ الرابط' : 'Failed to copy link');
    }
  };

  // Share functions
  const shareOnFacebook = () => {
    const url = window.location.href;
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank', 'width=600,height=400');
  };

  const shareOnTwitter = () => {
    const url = window.location.href;
    const text = deal?.title || 'Check out this deal!';
    window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`, '_blank', 'width=600,height=400');
  };

  const shareOnLinkedIn = () => {
    const url = window.location.href;
    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`, '_blank', 'width=600,height=400');
  };

  const shareOnWhatsApp = () => {
    const url = window.location.href;
    const text = deal?.title || 'Check out this deal!';
    window.open(`https://wa.me/?text=${encodeURIComponent(text + ' ' + url)}`, '_blank');
  };

  return (
    <>
      {/* Price Info */}
      {(deal.original_price || deal.discounted_price) && (
        <div className="bg-white rounded-2xl border-2 border-[#111827] shadow-[4px_4px_0px_0px_rgba(17,24,39,1)] p-6 mb-6">
          <div className={`text-[#111827] mb-4 ${isRTL ? 'text-right' : 'text-left'}`} style={{ fontSize: '18px', fontWeight: 700 }}>
            {isRTL ? 'تفاصيل السعر' : 'Price Details'}
          </div>
          {deal.original_price && (
            <div className={`flex items-center justify-between mb-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
              <span className="text-[#6B7280]">{isRTL ? 'السعر الأصلي' : 'Original Price'}</span>
              <span className="text-[#6B7280] line-through">${deal.original_price}</span>
            </div>
          )}
          {deal.discounted_price && (
            <div className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
              <span className="text-[#111827]" style={{ fontWeight: 600 }}>{isRTL ? 'السعر بعد الخصم' : 'Discounted Price'}</span>
              <span className="text-[#5FB57A]" style={{ fontSize: '24px', fontWeight: 700 }}>${deal.discounted_price}</span>
            </div>
          )}
        </div>
      )}

      {/* Share Widget */}
      <div className="bg-white rounded-2xl border-2 border-[#111827] shadow-[4px_4px_0px_0px_rgba(17,24,39,1)] p-6">
        <div className={`flex items-center gap-2 mb-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
          <Share2 className="h-5 w-5 text-[#5FB57A]" />
          <div className={`text-[#111827] ${isRTL ? 'text-right' : 'text-left'}`} style={{ fontSize: '18px', fontWeight: 700 }}>
            {isRTL ? 'شارك هذا العرض' : 'Share This Deal'}
          </div>
        </div>
        <p className="text-[#6B7280] text-sm mb-4 text-center">
          {isRTL ? 'شارك هذا العرض مع أصدقائك' : 'Share this deal with your friends'}
        </p>

        <div className="grid grid-cols-2 gap-3">
          {/* Facebook */}
          <button
            onClick={shareOnFacebook}
            className="flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-[#1877F2] hover:bg-[#166FE5] text-white transition-colors border-2 border-[#111827] shadow-[2px_2px_0px_0px_rgba(17,24,39,1)] hover:shadow-[1px_1px_0px_0px_rgba(17,24,39,1)] hover:translate-x-[1px] hover:translate-y-[1px]"
            aria-label="Share on Facebook"
          >
            <Facebook className="h-4 w-4" />
            <span className="text-sm" style={{ fontWeight: 600 }}>Facebook</span>
          </button>

          {/* Twitter */}
          <button
            onClick={shareOnTwitter}
            className="flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-[#000000] hover:bg-[#1a1a1a] text-white transition-colors border-2 border-[#111827] shadow-[2px_2px_0px_0px_rgba(17,24,39,1)] hover:shadow-[1px_1px_0px_0px_rgba(17,24,39,1)] hover:translate-x-[1px] hover:translate-y-[1px]"
            aria-label="Share on Twitter"
          >
            <Twitter className="h-4 w-4" />
            <span className="text-sm" style={{ fontWeight: 600 }}>Twitter</span>
          </button>

          {/* LinkedIn */}
          <button
            onClick={shareOnLinkedIn}
            className="flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-[#0A66C2] hover:bg-[#095196] text-white transition-colors border-2 border-[#111827] shadow-[2px_2px_0px_0px_rgba(17,24,39,1)] hover:shadow-[1px_1px_0px_0px_rgba(17,24,39,1)] hover:translate-x-[1px] hover:translate-y-[1px]"
            aria-label="Share on LinkedIn"
          >
            <Linkedin className="h-4 w-4" />
            <span className="text-sm" style={{ fontWeight: 600 }}>LinkedIn</span>
          </button>

          {/* WhatsApp */}
          <button
            onClick={shareOnWhatsApp}
            className="flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-[#25D366] hover:bg-[#20BD5B] text-white transition-colors border-2 border-[#111827] shadow-[2px_2px_0px_0px_rgba(17,24,39,1)] hover:shadow-[1px_1px_0px_0px_rgba(17,24,39,1)] hover:translate-x-[1px] hover:translate-y-[1px]"
            aria-label="Share on WhatsApp"
          >
            <MessageCircle className="h-4 w-4" />
            <span className="text-sm" style={{ fontWeight: 600 }}>WhatsApp</span>
          </button>
        </div>

        {/* Copy Link Button */}
        <button
          onClick={copyDealLink}
          className="w-full mt-3 flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-white hover:bg-[#E8F3E8] text-[#5FB57A] transition-colors border-2 border-[#5FB57A]"
        >
          {linkCopied ? (
            <>
              <Check className="h-4 w-4" />
              <span className="text-sm" style={{ fontWeight: 600 }}>
                {isRTL ? 'تم نسخ الرابط' : 'Link Copied'}
              </span>
            </>
          ) : (
            <>
              <LinkIcon className="h-4 w-4" />
              <span className="text-sm" style={{ fontWeight: 600 }}>
                {isRTL ? 'نسخ الرابط' : 'Copy Link'}
              </span>
            </>
          )}
        </button>
      </div>
    </>
  );
}