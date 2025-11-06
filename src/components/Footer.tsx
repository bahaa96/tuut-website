import { Facebook, Twitter, Instagram, Youtube, Mail, Tag } from "lucide-react";
import { useLanguage } from "../contexts/LanguageContext";
import { Link } from "../router";

export function Footer() {
  const { t, isRTL } = useLanguage();
  
  const footerLinks = {
    company: [
      { label: t('footer.about'), href: "#" },
      { label: isRTL ? "كيف يعمل" : "How It Works", href: "#" },
      { label: t('footer.careers'), href: "#" },
      { label: isRTL ? "المدونة" : "Blog", href: "#" },
    ],
    browse: [
      { label: isRTL ? "جميع الكوبونات" : "All Coupons", href: "/deals" },
      { label: isRTL ? "أفضل المتاجر" : "Top Stores", href: "/stores" },
      { label: isRTL ? "الفئات" : "Categories", href: "/#categories" },
      { label: isRTL ? "عروض جديدة" : "New Deals", href: "/deals" },
    ],
    support: [
      { label: t('footer.help'), href: "#" },
      { label: t('footer.faq'), href: "#" },
      { label: t('footer.contact'), href: "#" },
      { label: isRTL ? "إرسال عرض" : "Submit a Deal", href: "#" },
    ],
  };

  const socialLinks = [
    { icon: Facebook, href: "#", label: "Facebook" },
    { icon: Twitter, href: "#", label: "Twitter" },
    { icon: Instagram, href: "#", label: "Instagram" },
    { icon: Youtube, href: "#", label: "YouTube" },
  ];

  return (
    <footer className="bg-white border-t-2 border-[#111827]">
      <div className="container mx-auto max-w-[1200px] px-4 md:px-6 lg:px-8 py-12">
        {/* Main Footer Content */}
        <div className={`grid grid-cols-2 md:grid-cols-4 gap-8 mb-12 ${isRTL ? 'text-right' : ''}`}>
          {/* Brand Column */}
          <div className="col-span-2 md:col-span-1">
            <div className={`flex items-center gap-2 mb-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
              <Tag className="h-6 w-6 text-[#111827]" />
              <span className="text-[#111827]" style={{ fontWeight: 700, fontSize: '24px' }}>
                Tuut
              </span>
            </div>
            <p className="text-[#6B7280] mb-6 max-w-[280px]">
              {t('footer.tagline')}
            </p>
            
            {/* Contact Info */}
            <div className="space-y-3 text-sm text-[#6B7280]">
              <div className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                <Mail className="h-4 w-4" />
                <span>hello@tuut.com</span>
              </div>
            </div>
          </div>

          {/* Company Links */}
          <div>
            <h3 className="mb-4 text-[#111827]" style={{ fontWeight: 600 }}>{t('footer.company')}</h3>
            <ul className="space-y-2">
              {footerLinks.company.map((link, index) => (
                <li key={index}>
                  <a
                    href={link.href}
                    className="text-[#6B7280] hover:text-[#111827] transition-colors text-sm"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Browse Links */}
          <div>
            <h3 className="mb-4 text-[#111827]" style={{ fontWeight: 600 }}>{isRTL ? 'تصفح' : 'Browse'}</h3>
            <ul className="space-y-2">
              {footerLinks.browse.map((link, index) => (
                <li key={index}>
                  {link.href.startsWith('/#') ? (
                    <a
                      href={link.href}
                      className="text-[#6B7280] hover:text-[#111827] transition-colors text-sm"
                    >
                      {link.label}
                    </a>
                  ) : (
                    <Link
                      to={link.href}
                      className="text-[#6B7280] hover:text-[#111827] transition-colors text-sm"
                    >
                      {link.label}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </div>

          {/* Support Links */}
          <div>
            <h3 className="mb-4 text-[#111827]" style={{ fontWeight: 600 }}>{t('footer.support')}</h3>
            <ul className="space-y-2">
              {footerLinks.support.map((link, index) => (
                <li key={index}>
                  <a
                    href={link.href}
                    className="text-[#6B7280] hover:text-[#111827] transition-colors text-sm"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t-2 border-[#E5E7EB] pt-8">
          <div className={`flex flex-col md:flex-row items-center justify-between gap-4 ${isRTL ? 'md:flex-row-reverse' : ''}`}>
            {/* Copyright */}
            <div className="text-sm text-[#6B7280]">
              {t('footer.copyright')}
            </div>

            {/* Social Links */}
            <div className="flex items-center gap-3">
              <span className="text-sm text-[#6B7280] mr-2">{t('footer.followUs')}</span>
              {socialLinks.map((social, index) => {
                const Icon = social.icon;
                return (
                  <a
                    key={index}
                    href={social.href}
                    aria-label={social.label}
                    className="h-10 w-10 rounded-full border-2 border-[#111827] hover:bg-[#5FB57A] flex items-center justify-center transition-colors"
                  >
                    <Icon className="h-5 w-5 text-[#111827]" />
                  </a>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
