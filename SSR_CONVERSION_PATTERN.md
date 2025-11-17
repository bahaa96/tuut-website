# Server-Side Rendering (SSR) Conversion Pattern

This document outlines the standard pattern for converting client-side rendered pages to server-side rendered pages while preserving all functionality.

## Why This Pattern?

1. **SEO & Performance**: Pages load with actual data instead of "Loading..." state
2. **JavaScript Disabled Support**: Content is visible even when JS is disabled
3. **Progressive Enhancement**: Core content works immediately, interactivity enhances when JS loads
4. **Consistent User Experience**: No jarring loading states on page refresh

## Core Conversion Pattern

### 1. Identify Components to Convert

**Server-Side Rendered (Static Content):**
- Page layout and structure
- Deal/product information
- Text content and descriptions
- Images and media
- Navigation and links
- Forms with initial values

**Client-Side (Interactive Components):**
- Search and filter functionality
- Countdown timers
- Copy to clipboard buttons
- Share widgets
- Save/unsave functionality
- Modal dialogs
- Dynamic state changes

### 2. File Structure

```
app/[localeCountry]/[page]/[slug]/
├── page.tsx                 # Server-side rendered main page
├── [Page]ClientInteractions.tsx  # Client-side interactive components
└── [Page]ClientFilters.tsx       # Optional: Client-side filters/search
```

### 3. Server-Side Page Template

```typescript
// page.tsx
import { fetch[Data]By[Param] } from "../../../../lib/supabase-fetch";
import [Page]ClientInteractions from "./[Page]ClientInteractions";
import Link from "next/link";
import { [DataType] } from "../../../../domain-models";

interface [Page]Props {
  params: Promise<{
    localeCountry: string;
    [param]: string;
  }>;
}

export default async function [Page]({ params }: [Page]Props) {
  // Await params as required by Next.js 15
  const resolvedParams = await params;

  // Extract locale info
  const country = resolvedParams.localeCountry.split('-')[1];
  const language = resolvedParams.localeCountry.split('-')[0];
  const isRTL = language === 'ar';
  const [param] = resolvedParams.[param];

  // Fetch data server-side
  let [data]: [DataType] | null = null;
  let [relatedData]: [DataType][] = [];

  try {
    const result = await fetch[Data]By[Param]([param]);

    if (!result.error && result.data) {
      [data] = result.data;

      // Fetch related data if needed
      if ([data]?.[relation_id]) {
        const { createClient } = await import("../../../../utils/supabase/client");
        const supabase = createClient();

        const { data: related } = await supabase
          .from('[table]')
          .select('*')
          .eq('[relation_column]', [data].[relation_id])
          .limit(4);

        if (related) {
          [relatedData] = related;
        }
      }
    }
  } catch (error) {
    console.error('Error fetching [data]:', error);
  }

  // Handle 404 case
  if (![data]) {
    return (
      <section className="py-12 md:py-16 bg-[#E8F3E8] min-h-screen">
        <div className="container mx-auto max-w-[1200px] px-4 md:px-6 lg:px-8">
          <div className="text-center py-12">
            <h2 className="text-[#111827] mb-4" style={{ fontSize: '24px', fontWeight: 700 }}>
              {isRTL ? '[AR 404 message]' : '[EN 404 message]'}
            </h2>
            <Link href="/[back-path]" className="inline-flex items-center bg-white text-[#111827] border-2 border-[#111827] hover:bg-[#F0F7F0] px-6 py-3 rounded-xl font-medium transition-all shadow-[3px_3px_0px_0px_rgba(17,24,39,1)] hover:shadow-[1px_1px_0px_0px_rgba(17,24,39,1)]">
              {isRTL ? '[AR back text]' : '[EN back text]'}
            </Link>
          </div>
        </div>
      </section>
    );
  }

  // Get localized content
  const [title] = isRTL && [data].[title_ar] ? [data].[title_ar] : [data].[title];
  const [description] = isRTL && [data].[description_ar] ? [data].[description_ar] : [data].[description];

  return (
    <section className="py-12 md:py-16 bg-[#E8F3E8] min-h-screen">
      <div className="container mx-auto max-w-[1200px] px-4 md:px-6 lg:px-8">
        {/* Back Button */}
        <Link href="/[back-path]" className="inline-flex items-center text-[#5FB57A] hover:text-[#4FA669] mb-8 transition-colors">
          <ArrowLeft className={`h-5 w-5 ${isRTL ? 'ml-2 rotate-180' : 'mr-2'}`} />
          {isRTL ? '[AR back text]' : '[EN back text]'}
        </Link>

        {/* Main Content Layout */}
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            {/* Static Content */}
            <div className="bg-white rounded-2xl border-2 border-[#111827] shadow-[4px_4px_0px_0px_rgba(17,24,39,1)] p-8">
              {/* Title, Description, Images - all server-side rendered */}
              <h1 className="text-[#111827] mb-4" style={{ fontSize: '32px', fontWeight: 700 }} dir={isRTL ? 'rtl' : 'ltr'}>
                {[title]}
              </h1>

              {[description] && (
                <p className="text-[#6B7280] mb-6" style={{ fontSize: '18px' }} dir={isRTL ? 'rtl' : 'ltr'}>
                  {[description]}
                </p>
              )}

              {/* Client-side interactive components */}
              <[Page]ClientInteractions
                [data]={[data]}
                isRTL={isRTL}
                language={language}
              />
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            {/* Static sidebar content */}
          </div>
        </div>

        {/* Related Content */}
        {[relatedData].length > 0 && (
          <div className="mt-12">
            <h2 className={`text-[#111827] mb-6 ${isRTL ? 'text-right' : 'text-left'}`} style={{ fontSize: '28px', fontWeight: 700 }}>
              {isRTL ? '[AR related title]' : '[EN related title]'}
            </h2>
            <div className="grid sm:grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-6">
              {[relatedData].map((item) => (
                <[RelatedComponent]
                  key={item.id}
                  [item]={item}
                  isRTL={isRTL}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
```

### 4. Client Interactions Template

```typescript
// [Page]ClientInteractions.tsx
"use client";

import { useState, useEffect } from "react";
import { [DataType] } from "../../../domain-models";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { [Icons] } from "lucide-react";

interface [Page]ClientInteractionsProps {
  [data]: [DataType];
  isRTL: boolean;
  language: string;
}

export default function [Page]ClientInteractions({
  [data],
  isRTL,
  language
}: [Page]ClientInteractionsProps) {
  const [copied, setCopied] = useState(false);
  const [saved, setSaved] = useState(false);

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

  // Interactive functions
  const handleCopy = async () => {
    // Copy logic
  };

  const handleShare = () => {
    // Share logic
  };

  const toggleSave = () => {
    // Save logic
  };

  return (
    <>
      {/* Interactive buttons and components */}
      <Button onClick={handleCopy}>
        {copied ? 'Copied!' : 'Copy'}
      </Button>

      {/* Add other interactive components */}
    </>
  );
}
```

## Implementation Checklist

### Before Conversion:
- [ ] Identify all interactive features on the page
- [ ] Note all data fetching patterns
- [ ] Document user interactions and state changes
- [ ] Check for localStorage/sessionStorage usage
- [ ] Identify any client-side only dependencies

### During Conversion:
- [ ] Remove "use client" directive from main page
- [ ] Convert all async functions to server-side data fetching
- [ ] Move interactive components to separate client component
- [ ] Update all data fetching to use server-side patterns
- [ ] Preserve all styling and layout
- [ ] Maintain all user interactions and functionality

### After Conversion:
- [ ] Test page with JavaScript disabled
- [ ] Verify all interactive features still work
- [ ] Check SEO and page load performance
- [ ] Test responsive design
- [ ] Validate all links and navigation
- [ ] Test error states and 404 handling

## Common Patterns by Page Type

### Product/Deal Pages:
- Server-side: Product info, images, descriptions, pricing, terms
- Client-side: Copy code, share buttons, countdown timers, save functionality

### Category/List Pages:
- Server-side: Initial data set, filters, pagination
- Client-side: Search, filter interactions, sorting, infinite scroll

### Store Pages:
- Server-side: Store info, basic products list
- Client-side: Advanced filtering, search, sorting interactions

### Guide/Article Pages:
- Server-side: Article content, related articles
- Client-side: Share buttons, bookmarking, comments (if any)

## Error Handling Pattern

Always include proper error handling:

```typescript
// Server-side error handling
try {
  const result = await fetchData(param);
  if (!result.error && result.data) {
    // Process data
  }
} catch (error) {
  console.error('Error fetching data:', error);
  // Continue with fallback state or show error
}

// Client-side error handling
const handleAction = async () => {
  try {
    // Perform action
    toast.success(isRTL ? 'AR success' : 'EN success');
  } catch (error) {
    console.error('Action failed:', error);
    toast.error(isRTL ? 'AR error' : 'EN error');
  }
};
```

## Testing Strategy

1. **JavaScript Disabled**: Verify content loads and is readable
2. **Network Throttling**: Test performance with slow connections
3. **Error States**: Test with invalid params, missing data
4. **Functionality**: Ensure all interactive features work as before
5. **Responsive**: Test on mobile and desktop
6. **Accessibility**: Verify screen readers work properly

## Future Pages to Convert

Apply this pattern to:
- `/products/[slug]` - Product detail pages
- `/stores/[slug]` - Store pages
- `/guides/[slug]` - Guide/article pages
- `/categories/[slug]` - Category pages
- Any other dynamic pages requiring SSR

This pattern ensures consistent implementation and maintains all functionality while improving SEO and user experience.