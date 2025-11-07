import { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface RouterContextType {
  currentPath: string;
  navigate: (path: string) => void;
}

const RouterContext = createContext<RouterContextType | undefined>(undefined);

export function RouterProvider({ children }: { children: ReactNode }) {
  const [currentPath, setCurrentPath] = useState(window.location.pathname);

  useEffect(() => {
    const handleNavigation = () => {
      setCurrentPath(window.location.pathname);
    };

    // Listen to popstate (back/forward buttons)
    window.addEventListener("popstate", handleNavigation);

    return () => {
      window.removeEventListener("popstate", handleNavigation);
    };
  }, []);

  const navigate = (path: string) => {
    window.history.pushState({}, "", path);
    setCurrentPath(path);
  };

  return (
    <RouterContext.Provider value={{ currentPath, navigate }}>
      {children}
    </RouterContext.Provider>
  );
}

export function useRouter() {
  const context = useContext(RouterContext);
  if (!context) {
    throw new Error("useRouter must be used within RouterProvider");
  }
  return context;
}

// Simple Link component for navigation
export function Link({ 
  to, 
  children, 
  className 
}: { 
  to: string; 
  children: React.ReactNode; 
  className?: string;
}) {
  const { navigate } = useRouter();

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    navigate(to);
  };

  return (
    <a href={to} onClick={handleClick} className={className}>
      {children}
    </a>
  );
}

// Hook to extract URL parameters
export function useParams<T extends Record<string, string> = Record<string, string>>(): T {
  const { currentPath } = useRouter();
  
  // Extract params from path like /store/amazon or /blog/article-slug
  const pathParts = currentPath.split('/').filter(Boolean);
  const params: Record<string, string> = {};
  
  // Simple pattern matching for various routes with :slug parameter
  // Supported patterns: /store/:slug, /blog/:slug, /guides/:slug, /product/:slug
  if (pathParts.length >= 2) {
    const firstPart = pathParts[0];
    const secondPart = pathParts[1];
    
    if (['store', 'blog', 'guides', 'product'].includes(firstPart)) {
      params.slug = secondPart;
    }
  }
  
  return params as T;
}
