import { useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Card } from './ui/card';
import { 
  Search, 
  TrendingUp, 
  CheckCircle, 
  XCircle, 
  Shield,
  Award,
  Zap,
  ArrowRight
} from 'lucide-react';

interface Contributor {
  username: string;
  badge: string;
  badgeColor: string;
  icon: 'detective' | 'hero' | 'wizard';
  stat: string;
  statLabel: string;
}

interface Activity {
  username: string;
  action: string;
  code: string;
  store: string;
  time: string;
  status: 'verified' | 'invalidated';
}

interface PopularStore {
  name: string;
  avgSavings: string;
}

interface HotCode {
  discount: string;
  code: string;
  verified: boolean;
  description: string;
  usageCount: string;
  store: string;
}

export function CommunityActivity() {
  const { language } = useLanguage();
  const isRTL = language === 'ar';
  const [searchQuery, setSearchQuery] = useState('');

  // Mock data for top contributors
  const topContributors: Contributor[] = [
    {
      username: 'Vicoo821',
      badge: language === 'en' ? 'DEAL DETECTIVE' : 'محقق العروض',
      badgeColor: 'bg-[#5FB57A]',
      icon: 'detective',
      stat: '1,129',
      statLabel: language === 'en' ? 'Contributed' : 'ساهم',
    },
    {
      username: 'Vicoo821',
      badge: language === 'en' ? 'SAVINGS HERO' : 'بطل التوفير',
      badgeColor: 'bg-[#5FB57A]',
      icon: 'hero',
      stat: '$492',
      statLabel: language === 'en' ? 'Helped members save' : 'ساعد الأعضاء في توفير',
    },
    {
      username: 'GoJOSatoru',
      badge: language === 'en' ? 'TEST WIZ' : 'ساحر الاختبار',
      badgeColor: 'bg-[#5FB57A]',
      icon: 'wizard',
      stat: '1,037',
      statLabel: language === 'en' ? 'Verified codes' : 'أكواد تم التحقق منها',
    },
  ];

  // Mock data for popular stores
  const popularStores: PopularStore[] = [
    { name: 'Etsy', avgSavings: language === 'en' ? '$32 avg. savings' : 'متوسط توفير $32' },
    { name: 'Mercari', avgSavings: language === 'en' ? '$17 avg. savings' : 'متوسط توفير $17' },
    { name: 'Vistaprint', avgSavings: language === 'en' ? '$51 avg. savings' : 'متوسط توفير $51' },
    { name: 'Jiffy Lube', avgSavings: language === 'en' ? '$30 avg. savings' : 'متوسط توفير $30' },
  ];

  // Mock data for hot codes
  const hotCodes: HotCode[] = [
    {
      discount: language === 'en' ? 'Up to 10% off' : 'حتى 10% خصم',
      code: 'PINSKY',
      verified: true,
      description: language === 'en' ? '10% Off (Storewide) at Lumin' : 'خصم 10% (على كل المتجر) في Lumin',
      usageCount: language === 'en' ? 'Used 1,061 times' : 'استخدم 1,061 مرة',
      store: 'Lumin',
    },
    {
      discount: language === 'en' ? 'Up to 20% off' : 'حتى 20% خصم',
      code: 'CIRQ20',
      verified: true,
      description: language === 'en' ? '20% Off Storewide at Paranormal Cirque' : 'خصم 20% على كل المتجر في Paranormal Cirque',
      usageCount: language === 'en' ? 'Used 13,874 times' : 'استخدم 13,874 مرة',
      store: 'Paranormal Cirque',
    },
    {
      discount: language === 'en' ? 'Up to 15% off' : 'حتى 15% خصم',
      code: 'CRAFT15',
      verified: true,
      description: language === 'en' ? '15% Off Storewide at Crunchyroll' : 'خصم 15% على كل المتجر في Crunchyroll',
      usageCount: language === 'en' ? 'Used 10,074 times' : 'استخدم 10,074 مرة',
      store: 'Crunchyroll',
    },
    {
      discount: language === 'en' ? 'Up to $25 off' : 'حتى $25 خصم',
      code: 'W60',
      verified: true,
      description: language === 'en' ? '$25 Off Storewide at 4imprint' : 'خصم $25 على كل المتجر في 4imprint',
      usageCount: language === 'en' ? 'Used 7,511 times' : 'استخدم 7,511 مرة',
      store: '4imprint',
    },
  ];

  // Mock data for today's activity
  const todaysActivity: Activity[] = [
    {
      username: 'RonJrJohnson',
      action: language === 'en' ? 'verified code' : 'تحقق من الكود',
      code: 'EMAIL',
      store: 'Castano Group',
      time: language === 'en' ? '45s ago' : 'منذ 45 ثانية',
      status: 'verified',
    },
    {
      username: 'RonJrJohnson',
      action: language === 'en' ? 'verified code' : 'تحقق من الكود',
      code: 'IGNITE10FF',
      store: 'ProVape',
      time: language === 'en' ? '56s ago' : 'منذ 56 ثانية',
      status: 'verified',
    },
    {
      username: 'Kony24',
      action: language === 'en' ? 'invalidated code' : 'أبطل الكود',
      code: 'Prime',
      store: 'Village Hat Shop',
      time: language === 'en' ? '58s ago' : 'منذ 58 ثانية',
      status: 'invalidated',
    },
    {
      username: 'dragonjeffer',
      action: language === 'en' ? 'invalidated code' : 'أبطل الكود',
      code: 'HBDCKQVQFR4',
      store: 'Camp',
      time: language === 'en' ? '1min ago' : 'منذ دقيقة',
      status: 'invalidated',
    },
    {
      username: 'WonderPhoenix8283',
      action: language === 'en' ? 'invalidated code' : 'أبطل الكود',
      code: 'CARDFINALULTRA',
      store: 'Rabble Game',
      time: language === 'en' ? '1min ago' : 'منذ دقيقة',
      status: 'invalidated',
    },
  ];

  const getBadgeIcon = (icon: string) => {
    switch (icon) {
      case 'detective':
        return <Shield className="h-8 w-8 text-white" />;
      case 'hero':
        return <Award className="h-8 w-8 text-white" />;
      case 'wizard':
        return <Zap className="h-8 w-8 text-white" />;
      default:
        return <Shield className="h-8 w-8 text-white" />;
    }
  };

  return (
    <section className="py-12 md:py-16 bg-white">
      <div className="container mx-auto max-w-[1200px] px-4 md:px-6 lg:px-8">
        {/* Section Header */}
        <div className={`flex items-center justify-between mb-10 ${isRTL ? 'flex-row-reverse' : ''}`}>
          <div>
            <h2 className="mb-2 text-[#111827]" style={{ fontSize: '36px', fontWeight: 700 }}>
              {language === 'en' ? 'Community Activity' : 'نشاط المجتمع'}
            </h2>
            <p className="text-[#6B7280]">
              {language === 'en' 
                ? 'See what our community members are saving right now'
                : 'شاهد ما يوفره أعضاء مجتمعنا الآن'}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column */}
          <div className="space-y-6">
            {/* Search Section */}
            <Card className="p-6 bg-[#E8F3E8] border-2 border-[#111827] rounded-xl shadow-[3px_3px_0px_0px_rgba(17,24,39,1)]">
              <h3 className="text-xl mb-4 text-[#111827]" style={{ fontWeight: 700 }}>
                {language === 'en' 
                  ? 'Find verified coupon codes'
                  : 'اعثر على أكواد قسائم موثقة'}
              </h3>
              <p className="text-[#6B7280] text-sm mb-6">
                {language === 'en' 
                  ? 'Search from over 400,000 stores'
                  : 'ابحث من أكثر من 400,000 متجر'}
              </p>
              
              <div className={`flex gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
                <div className="flex-1 relative">
                  <Search className={`absolute top-1/2 -translate-y-1/2 ${isRTL ? 'right-4' : 'left-4'} h-5 w-5 text-[#6B7280]`} />
                  <Input
                    type="text"
                    placeholder={language === 'en' ? 'Where are you shopping today?' : 'أين تتسوق اليوم؟'}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className={`border-2 border-[#111827] h-12 ${isRTL ? 'pr-12' : 'pl-12'} rounded-lg bg-white`}
                  />
                </div>
                <Button 
                  className="bg-[#5FB57A] hover:bg-[#4FA569] text-white h-12 px-6 rounded-lg border-2 border-[#111827] shadow-[2px_2px_0px_0px_rgba(17,24,39,1)] hover:shadow-[1px_1px_0px_0px_rgba(17,24,39,1)] transition-all"
                >
                  {language === 'en' ? 'Find' : 'بحث'}
                </Button>
              </div>
            </Card>

            {/* Popular Right Now */}
            <Card className="p-6 border-2 border-[#111827] rounded-xl shadow-[3px_3px_0px_0px_rgba(17,24,39,1)]">
              <h3 className="text-xl mb-4 text-[#111827]" style={{ fontWeight: 700 }}>
                {language === 'en' ? 'Popular right now' : 'رائج الآن'}
              </h3>
              
              <div className="grid grid-cols-2 gap-3">
                {popularStores.map((store, index) => (
                  <button
                    key={index}
                    className="bg-[#E8F3E8] hover:bg-[#D1E7D1] transition-colors rounded-xl p-4 text-left border-2 border-transparent hover:border-[#5FB57A]"
                  >
                    <div className="text-[#111827] mb-1" style={{ fontWeight: 600 }}>{store.name}</div>
                    <div className="text-sm text-[#6B7280]">{store.avgSavings}</div>
                  </button>
                ))}
              </div>
            </Card>

            {/* Today's Hottest Codes */}
            <Card className="p-6 border-2 border-[#111827] rounded-xl shadow-[3px_3px_0px_0px_rgba(17,24,39,1)]">
              <h3 className="text-xl mb-4 text-[#111827]" style={{ fontWeight: 700 }}>
                {language === 'en' ? "Today's hottest codes" : 'أكثر الأكواد رواجًا اليوم'}
              </h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {hotCodes.map((code, index) => (
                  <div
                    key={index}
                    className="bg-[#F9FAFB] border-2 border-[#E5E7EB] rounded-xl p-4 hover:border-[#5FB57A] transition-colors"
                  >
                    <div className={`flex items-start gap-3 mb-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
                      <div className="w-10 h-10 rounded-lg bg-[#E8F3E8] border-2 border-[#5FB57A] flex items-center justify-center flex-shrink-0">
                        <TrendingUp className="h-5 w-5 text-[#5FB57A]" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-[#111827] mb-1" style={{ fontWeight: 600 }}>{code.discount}</div>
                        <div className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                          <span className="text-[#5FB57A] text-sm" style={{ fontWeight: 700 }}>
                            {code.code}
                          </span>
                          {code.verified && (
                            <CheckCircle className="h-4 w-4 text-[#5FB57A]" />
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="text-sm text-[#6B7280] mb-2 line-clamp-2">{code.description}</div>
                    <div className="text-xs text-[#9CA3AF]">
                      {code.usageCount}
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Live Community Activity */}
            <Card className="p-6 border-2 border-[#111827] rounded-xl shadow-[3px_3px_0px_0px_rgba(17,24,39,1)]">
              <div className={`flex items-center justify-between mb-6 ${isRTL ? 'flex-row-reverse' : ''}`}>
                <h3 className="text-xl text-[#111827]" style={{ fontWeight: 700 }}>
                  {language === 'en' ? 'Live activity' : 'نشاط مباشر'}
                </h3>
                <div className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                  <span className="text-xs text-[#6B7280]" style={{ fontWeight: 600 }}>
                    {language === 'en' ? 'LIVE' : 'مباشر'}
                  </span>
                </div>
              </div>

              {/* Top Contributors */}
              <div className="mb-6">
                <h4 className="text-sm mb-4 text-[#6B7280]" style={{ fontWeight: 600 }}>
                  {language === 'en' ? "This week's top contributors" : 'أفضل المساهمين هذا الأسبوع'}
                </h4>
                
                <div className="grid grid-cols-3 gap-3">
                  {topContributors.map((contributor, index) => (
                    <div
                      key={index}
                      className="bg-[#E8F3E8] border-2 border-[#5FB57A] rounded-xl p-4 text-center"
                    >
                      <div className="relative inline-block mb-2">
                        <div className="w-12 h-12 rounded-full bg-[#5FB57A] flex items-center justify-center mb-2">
                          {getBadgeIcon(contributor.icon)}
                        </div>
                      </div>
                      <Badge className={`${contributor.badgeColor} text-white text-[10px] mb-2 border-0 rounded px-2`}>
                        {contributor.badge}
                      </Badge>
                      <div className="text-sm text-[#111827] mb-1" style={{ fontWeight: 600 }}>{contributor.username}</div>
                      <div className="text-xs text-[#6B7280] mb-1">
                        {contributor.statLabel}
                      </div>
                      <div className="text-sm text-[#5FB57A]" style={{ fontWeight: 700 }}>
                        {contributor.stat}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Today's Activity Feed */}
              <div>
                <h4 className="text-sm mb-4 text-[#6B7280]" style={{ fontWeight: 600 }}>
                  {language === 'en' ? "Today's activity" : 'نشاط اليوم'}
                </h4>
                
                <div className="space-y-2 max-h-[320px] overflow-y-auto">
                  {todaysActivity.map((activity, index) => (
                    <div
                      key={index}
                      className="bg-[#F9FAFB] border border-[#E5E7EB] rounded-lg p-3 hover:bg-[#E8F3E8] transition-colors"
                    >
                      <div className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
                        <div className="flex-1 min-w-0">
                          <div className={`flex items-center gap-2 mb-1 ${isRTL ? 'flex-row-reverse' : ''}`}>
                            <span className="text-sm text-[#111827]" style={{ fontWeight: 600 }}>{activity.username}</span>
                            <span className="text-xs text-[#9CA3AF]">{activity.time}</span>
                          </div>
                          <div className="text-sm text-[#6B7280]">
                            {activity.action}{' '}
                            <span className="text-[#5FB57A]" style={{ fontWeight: 600 }}>
                              {activity.code}
                            </span>
                            {' '}at {activity.store}
                          </div>
                        </div>
                        {activity.status === 'verified' ? (
                          <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 ml-2" />
                        ) : (
                          <XCircle className="h-5 w-5 text-red-500 flex-shrink-0 ml-2" />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-3 mt-6 pt-6 border-t-2 border-[#E5E7EB]">
                <div className="text-center">
                  <div className="text-2xl text-[#5FB57A] mb-1" style={{ fontWeight: 700 }}>
                    $1,825
                  </div>
                  <div className="text-xs text-[#6B7280]">
                    {language === 'en' ? 'Saved today' : 'وفر اليوم'}
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-2xl text-[#5FB57A] mb-1" style={{ fontWeight: 700 }}>
                    131K
                  </div>
                  <div className="text-xs text-[#6B7280]">
                    {language === 'en' ? 'Verified' : 'تم التحقق'}
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-2xl text-[#5FB57A] mb-1" style={{ fontWeight: 700 }}>
                    13.4K
                  </div>
                  <div className="text-xs text-[#6B7280]">
                    {language === 'en' ? 'Active codes' : 'أكواد نشطة'}
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}
