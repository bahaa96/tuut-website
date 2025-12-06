import { Product } from "@/domain-models/Product";

interface ProductCollectionStructuredDataProps {
  products: Product[];
  url: string;
  name: string;
  description: string;
  language: string;
  country: string;
  pageCount?: number;
  currentPage?: number;
  hasPreviousPage?: boolean;
  hasNextPage?: boolean;
  previousPageUrl?: string;
  nextPageUrl?: string;
}

interface BreadcrumbStructuredDataProps {
  items: Array<{
    name: string;
    url: string;
  }>;
}

interface ArticleStructuredDataProps {
  article: {
    title?: string;
    description?: string;
    url?: string;
    image?: string;
    datePublished?: string;
    dateModified?: string;
    author?: string;
    content?: string;
    featured?: boolean;
    view_count?: number;
    like_count?: number;
  };
  url: string;
  language: string;
  country: string;
}

export function ArticleStructuredData({
  article,
  url,
  language,
  country,
}: ArticleStructuredDataProps) {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": article.featured ? "NewsArticle" : "Article",
    headline: article.title,
    description: article.description,
    image: article.image,
    url: url,
    datePublished: article.datePublished,
    dateModified: article.dateModified,
    inLanguage: language,
    about: {
      "@type": "Thing",
      name: country,
    },
    author: {
      "@type": "Person",
      name: article.author || "Tuut Team",
    },
    publisher: {
      "@type": "Organization",
      name: "Tuut",
      url: "https://tuut.shop",
      logo: {
        "@type": "ImageObject",
        url: "https://tuut.shop/logo.png",
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": url,
    },
    ...(article.view_count && {
      interactionStatistic: {
        "@type": "InteractionCounter",
        interactionType: "https://schema.org/ViewAction",
        userInteractionCount: article.view_count,
      },
    }),
    articleBody: article.content?.replace(/<[^>]*>/g, '').substring(0, 200) + "...",
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(structuredData, null, 2),
      }}
    />
  );
}

interface ProductStructuredDataProps {
  product: Product;
  url: string;
  language: string;
  country: string;
}

export function ProductCollectionStructuredData({
  products,
  url,
  name,
  description,
  language,
  country,
  pageCount,
  currentPage = 1,
  hasPreviousPage,
  hasNextPage,
  previousPageUrl,
  nextPageUrl,
}: ProductCollectionStructuredDataProps) {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name,
    description,
    url,
    inLanguage: language,
    about: {
      "@type": "Thing",
      name: country,
    },
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: products.length,
      itemListElement: products.map((product, index) => ({
        "@type": "ListItem",
        position: index + 1,
        item: {
          "@type": "Product",
          name: product.title,
          description: product.description,
          image: product.images,
          brand: {
            "@type": "Brand",
            name: product.store,
          },
          offers: {
            "@type": "Offer",
            price: product.price,
            priceCurrency: product.currency,
            availability: product.available ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
            priceValidUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days from now
          },
          category: product.categories?.join(", "),
          url: product.url,
        },
      })),
    },
    ...(pageCount && {
      pagination: {
        "@type": "PaginationData",
        totalItems: pageCount * products.length, // Approximate
        pageSize: products.length,
        currentPage,
        hasNextPage,
        hasPreviousPage,
        ...(nextPageUrl && { nextPage: nextPageUrl }),
        ...(previousPageUrl && { previousPage: previousPageUrl }),
      },
    }),
    provider: {
      "@type": "Organization",
      name: "Tuut",
      url: "https://tuut.shop",
      logo: {
        "@type": "ImageObject",
        url: "https://tuut.shop/logo.png",
      },
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(structuredData, null, 2),
      }}
    />
  );
}

export function BreadcrumbStructuredData({ items }: BreadcrumbStructuredDataProps) {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(structuredData, null, 2),
      }}
    />
  );
}

export function ProductStructuredData({
  product,
  url,
  language,
  country,
}: ProductStructuredDataProps) {
  const hasDiscount = product.original_price && product.price && product.price < product.original_price;

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.title,
    description: product.description,
    image: product.images,
    brand: {
      "@type": "Brand",
      name: product.store,
    },
    offers: {
      "@type": "Offer",
      price: product.price,
      priceCurrency: product.currency,
      availability: product.available ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
      priceValidUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days from now
      seller: {
        "@type": "Organization",
        name: product.store,
      },
      ...(hasDiscount && {
        highPrice: product.original_price,
        lowPrice: product.price,
      }),
      url: product.url,
    },
    category: product.categories?.join(", "),
    url: url,
    inLanguage: language,
    additionalProperty: [
      {
        "@type": "PropertyValue",
        name: "store_id",
        value: product.store_id,
      },
      ...(product.rating ? [{
        "@type": "AggregateRating",
        ratingValue: product.rating,
        reviewCount: 1,
        bestRating: 5,
        worstRating: 1,
      }] : []),
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(structuredData, null, 2),
      }}
    />
  );
}

interface FAQStructuredDataProps {
  faqs: Array<{
    question: string;
    answer: string;
  }>;
}

export function FAQStructuredData({ faqs }: FAQStructuredDataProps) {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(structuredData, null, 2),
      }}
    />
  );
}

interface WebsiteStructuredDataProps {
  url: string;
  name: string;
  description: string;
}

interface CollectionStructuredDataProps {
  items: Array<{
    name: string;
    description: string;
    url: string;
    image?: string;
    datePublished?: string;
    author?: string;
  }>;
  url: string;
  name: string;
  description: string;
  language: string;
  country: string;
  itemType: "Article" | "Product" | "Recipe" | "Course" | "Event";
}

export function CollectionStructuredData({
  items,
  url,
  name,
  description,
  language,
  country,
  itemType,
}: CollectionStructuredDataProps) {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name,
    description,
    url,
    inLanguage: language,
    about: {
      "@type": "Thing",
      name: country,
    },
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: items.length,
      itemListElement: items.map((item, index) => ({
        "@type": "ListItem",
        position: index + 1,
        item: {
          "@type": itemType,
          name: item.name,
          description: item.description,
          url: item.url,
          image: item.image,
          datePublished: item.datePublished,
          author: {
            "@type": "Person",
            name: item.author,
          },
        },
      })),
    },
    provider: {
      "@type": "Organization",
      name: "Tuut",
      url: "https://tuut.shop",
      logo: {
        "@type": "ImageObject",
        url: "https://tuut.shop/logo.png",
      },
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(structuredData, null, 2),
      }}
    />
  );
}

export function WebsiteStructuredData({ url, name, description }: WebsiteStructuredDataProps) {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name,
    url,
    description,
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${url}?search={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
    publisher: {
      "@type": "Organization",
      name: "Tuut",
      url: "https://tuut.shop",
      logo: {
        "@type": "ImageObject",
        url: "https://tuut.shop/logo.png",
      },
      sameAs: [
        "https://twitter.com/tuutapp",
        "https://facebook.com/tuutapp",
        "https://instagram.com/tuutapp",
      ],
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(structuredData, null, 2),
      }}
    />
  );
}