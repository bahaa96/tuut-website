import { Search } from "lucide-react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { useLanguage } from "../contexts/LanguageContext";
import { useRouter } from "../router";
import { useState, FormEvent } from "react";

export function Hero() {
  const { t, isRTL } = useLanguage();
  const { navigate } = useRouter();
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (e: FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <section className="relative bg-background pt-8 pb-4 md:pt-12 md:pb-6 overflow-hidden flex items-center">
      <div className="container mx-auto max-w-[800px] px-4 md:px-6 lg:px-8">
        {/* Centered Content */}
        <div className="text-center">
          {/* Title */}
          <h1 
            className="text-[#111827] mb-2" 
            style={{ fontSize: '48px', fontWeight: 700, lineHeight: 1.2 }}
          >
            {isRTL ? 'وفر أكثر مع Tuut' : 'Save more with Tuut'}
          </h1>

          {/* Subtitle */}
          <p className="text-[#6B7280] mb-4" style={{ fontSize: '18px' }}>
            {isRTL ? 'اكتشف أفضل العروض والكوبونات من أكثر من 500 متجر' : 'Discover the best deals and coupons from 500+ top brands'}
          </p>

          {/* Search Bar */}
          <div className="max-w-3xl mx-auto">
            <form onSubmit={handleSearch} className="relative flex gap-2">
              <div className="relative flex-1">
                <Search className={`absolute top-1/2 -translate-y-1/2 h-6 w-6 text-[#6B7280] ${isRTL ? 'right-6' : 'left-6'}`} />
                <Input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={isRTL ? 'ابحث عن المتاجر أو العروض أو الفئات...' : 'Search for stores, deals, or categories...'}
                  className={`h-16 ${isRTL ? 'pr-16 text-right' : 'pl-16'} text-lg border-2 border-[#111827] rounded-2xl shadow-[6px_6px_0px_0px_rgba(17,24,39,1)] focus-visible:outline-none transition-all`}
                />
              </div>
              <Button
                type="submit"
                className="h-16 px-8 bg-[#5FB57A] hover:bg-[#4FA468] text-white rounded-xl border-2 border-[#111827] shadow-[6px_6px_0px_0px_rgba(17,24,39,1)] hover:shadow-[3px_3px_0px_0px_rgba(17,24,39,1)] hover:translate-x-[3px] hover:translate-y-[3px] transition-all"
              >
                {isRTL ? 'بحث' : 'Search'}
              </Button>
            </form>
          </div>

          {/* Quick Links */}
          <div className={`mt-3 flex flex-wrap items-center justify-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <span className="text-[#6B7280] text-sm">
              {isRTL ? 'شائع:' : 'Popular:'}
            </span>
            <button 
              onClick={() => navigate('/search?q=' + encodeURIComponent(isRTL ? 'أمازون' : 'Amazon'))}
              className="text-[#111827] text-sm bg-white px-4 py-2 rounded-lg border-2 border-[#111827] hover:bg-[#E8F3E8] transition-colors"
            >
              {isRTL ? 'أمازون' : 'Amazon'}
            </button>
            <button 
              onClick={() => navigate('/search?q=' + encodeURIComponent(isRTL ? 'نون' : 'Noon'))}
              className="text-[#111827] text-sm bg-white px-4 py-2 rounded-lg border-2 border-[#111827] hover:bg-[#E8F3E8] transition-colors"
            >
              {isRTL ? 'نون' : 'Noon'}
            </button>
            <button 
              onClick={() => navigate('/search?q=' + encodeURIComponent(isRTL ? 'إلكترونيات' : 'Electronics'))}
              className="text-[#111827] text-sm bg-white px-4 py-2 rounded-lg border-2 border-[#111827] hover:bg-[#E8F3E8] transition-colors"
            >
              {isRTL ? 'إلكترونيات' : 'Electronics'}
            </button>
            <button 
              onClick={() => navigate('/search?q=' + encodeURIComponent(isRTL ? 'أزياء' : 'Fashion'))}
              className="text-[#111827] text-sm bg-white px-4 py-2 rounded-lg border-2 border-[#111827] hover:bg-[#E8F3E8] transition-colors"
            >
              {isRTL ? 'أزياء' : 'Fashion'}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
