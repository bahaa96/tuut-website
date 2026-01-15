'use client';

import { useState } from 'react';
import { ChevronLeft, ChevronRight, Package } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { Card } from './ui/card';
import { Badge } from './ui/badge';

interface ProductImageGalleryProps {
  images: string[];
  title: string;
  discount?: number;
  rating?: number;
  isRTL?: boolean;
  language?: string;
}

export function ProductImageGallery({
  images,
  title,
  discount = 0,
  rating,
  isRTL = false,
  language = 'en',
}: ProductImageGalleryProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const nextImage = () => {
    if (images && images.length > 0) {
      setCurrentImageIndex((prev) => (prev + 1) % images.length);
    }
  };

  const prevImage = () => {
    if (images && images.length > 0) {
      setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
    }
  };

  return (
    <div>
      <Card className="p-0 overflow-hidden border-2 border-[#E5E7EB] rounded-xl">
        <div className="relative bg-linear-to-br from-[#E8F3E8] to-[#D1E7D1] aspect-square">
          {images && images.length > 0 ? (
            <>
              <ImageWithFallback
                src={images[currentImageIndex]}
                alt={title}
                width={600}
                height={600}
                className="w-full h-full object-contain p-8"
              />
              {images.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    className={`absolute top-1/2 -translate-y-1/2 ${isRTL ? 'right-4' : 'left-4'} bg-white/90 hover:bg-white p-2 rounded-full shadow-lg transition-all`}
                  >
                    {isRTL ? <ChevronRight className="h-6 w-6" /> : <ChevronLeft className="h-6 w-6" />}
                  </button>
                  <button
                    onClick={nextImage}
                    className={`absolute top-1/2 -translate-y-1/2 ${isRTL ? 'left-4' : 'right-4'} bg-white/90 hover:bg-white p-2 rounded-full shadow-lg transition-all`}
                  >
                    {isRTL ? <ChevronLeft className="h-6 w-6" /> : <ChevronRight className="h-6 w-6" />}
                  </button>
                </>
              )}
            </>
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <Package className="h-24 w-24 text-[#5FB57A] opacity-50" />
            </div>
          )}

          {/* Badges */}
          <div className={`absolute top-4 ${isRTL ? 'right-4' : 'left-4'} flex flex-col gap-2`}>
            {discount > 0 && (
              <Badge className="bg-red-500 text-white border-0 rounded-lg">
                {discount}% {language === 'ar' ? 'خصم' : 'OFF'}
              </Badge>
            )}
            {rating && rating >= 4 && (
              <Badge className="bg-[#5FB57A] text-white border-0 rounded-lg">
                {language === 'ar' ? 'الأعلى تقييماً' : 'Top Rated'}
              </Badge>
            )}
          </div>
        </div>
      </Card>

      {/* Thumbnail Gallery */}
      {images && images.length > 1 && (
        <div className="grid grid-cols-6 gap-2 mt-4">
          {images.map((image, index) => (
            <button
              key={index}
              onClick={() => setCurrentImageIndex(index)}
              className={`relative aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                currentImageIndex === index
                  ? 'border-[#5FB57A]'
                  : 'border-[#E5E7EB] hover:border-[#5FB57A]/50'
              }`}
            >
              <ImageWithFallback
                src={image}
                alt={`${title} - ${index + 1}`}
                width={100}
                height={100}
                className="w-full h-full object-contain bg-linear-to-br from-[#E8F3E8] to-[#D1E7D1] p-1"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
