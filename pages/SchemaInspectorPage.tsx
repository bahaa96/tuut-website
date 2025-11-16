import { SchemaInspector } from "../components/SchemaInspector";
import { useLanguage } from "../contexts/LanguageContext";

export function SchemaInspectorPage() {
  const { isRTL } = useLanguage();
  
  return (
    <div className="min-h-screen py-12">
      <div className="container mx-auto max-w-[1200px] px-4 md:px-6 lg:px-8">
        <div className={`mb-8 ${isRTL ? 'text-right' : 'text-left'}`}>
          <h1 className="text-[#111827] mb-4" style={{ fontSize: '36px', fontWeight: 700 }}>
            {isRTL ? 'فاحص مخطط قاعدة البيانات' : 'Database Schema Inspector'}
          </h1>
          <p className="text-[#6B7280] mb-6">
            {isRTL 
              ? 'عرض بنية قاعدة البيانات والبيانات المميزة'
              : 'View database structure and featured deals data'}
          </p>
          <a 
            href="/"
            className="inline-flex items-center text-[#5FB57A] hover:underline"
          >
            {isRTL ? '← العودة إلى الصفحة الرئيسية' : '← Back to Homepage'}
          </a>
        </div>
        
        <SchemaInspector />
      </div>
    </div>
  );
}
