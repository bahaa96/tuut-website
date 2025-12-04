"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import {
  Search,
  Grid,
  List,
  Filter,
  X,
  ChevronDown,
  Store as StoreIcon,
} from "lucide-react";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { Badge } from "../../../components/ui/badge";
import { Skeleton } from "../../../components/ui/skeleton";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../../components/ui/dropdown-menu";
import { Store } from "@/domain-models/Store";
import { useAllStores } from "./useAllStores";
import * as m from "@/src/paraglide/messages";
import { getLocale } from "@/src/paraglide/runtime";
import StoreCard from "./StoreCard";

type ViewMode = "grid" | "list";
type SortOption = "name" | "deals" | "featured";

export default function StoresClientPage({
  initialStores,
}: {
  initialStores: Store[];
}) {
  const [hasMore, setHasMore] = useState(initialStores.length > 20);
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [sortBy, setSortBy] = useState<SortOption>("featured");
  const observerRef = useRef<IntersectionObserver | null>(null);
  const loadMoreRef = useRef<HTMLDivElement>(null);

  const language = getLocale();
  const isRTL = language === "ar";

  const {
    allStores,
    isLoadingAllStores,
    errorLoadingAllStores,
    allStoresCurrentPage,
    allStoresChangePage,
    allStoresFilters,
    allStoresChangeFilters,
    refetchAllStores,
  } = useAllStores(initialStores);

  // Load more stores
  const loadMore = useCallback(() => {
    allStoresChangePage(allStoresCurrentPage + 1);
  }, [allStoresCurrentPage]);

  // Infinite scroll observer
  useEffect(() => {
    if (observerRef.current) {
      observerRef.current.disconnect();
    }

    observerRef.current = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !isLoadingAllStores) {
          loadMore();
        }
      },
      { threshold: 0.1 }
    );

    if (loadMoreRef.current) {
      observerRef.current.observe(loadMoreRef.current);
    }

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [hasMore, isLoadingAllStores, loadMore]);

  return (
    <div className="min-h-screen bg-background">
      {/* Search and Filters Bar */}
      <div
        className={`mb-8 bg-white rounded-2xl border-2 border-[#111827] shadow-[4px_4px_0px_0px_rgba(17,24,39,1)] p-4 md:p-6`}
      >
        <div
          className={`flex flex-col md:flex-row gap-4 ${
            isRTL ? "md:flex-row-reverse" : ""
          }`}
        >
          {/* Search Input */}
          <div className="flex-1 relative">
            <Search
              className={`absolute top-1/2 -translate-y-1/2 h-5 w-5 text-[#6B7280] ${
                isRTL ? "right-3" : "left-3"
              }`}
            />
            <Input
              type="text"
              placeholder={m.SEARCH_STORES()}
              value={allStoresFilters.searchText}
              onChange={(e) =>
                allStoresChangeFilters({ searchText: e.target.value })
              }
              className={`${
                isRTL ? "pr-10 pl-4" : "pl-10 pr-4"
              } h-12 border-2 border-[#111827] rounded-xl`}
            />
            {allStoresFilters.searchText && (
              <button
                onClick={() => allStoresChangeFilters({ searchText: "" })}
                className={`absolute top-1/2 -translate-y-1/2 ${
                  isRTL ? "left-3" : "right-3"
                }`}
              >
                <X className="h-5 w-5 text-[#6B7280] hover:text-[#111827]" />
              </button>
            )}
          </div>

          {/* Sort Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                className={`h-12 border-2 border-[#111827] rounded-xl px-6 ${
                  isRTL ? "flex-row-reverse" : ""
                }`}
              >
                <Filter className={`h-4 w-4 ${isRTL ? "ml-2" : "mr-2"}`} />
                {m.SORT_BY()}
                <ChevronDown className={`h-4 w-4 ${isRTL ? "mr-2" : "ml-2"}`} />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              className={`${isRTL ? "text-right" : "text-left"}`}
            >
              <DropdownMenuItem onClick={() => setSortBy("featured")}>
                {m.FEATURED()}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSortBy("name")}>
                {m.NAME_A_Z()}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSortBy("deals")}>
                {m.MOST_DEALS()}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* View Mode Toggle */}
          <div className="flex gap-2">
            <Button
              variant={viewMode === "grid" ? "default" : "outline"}
              onClick={() => setViewMode("grid")}
              className={`h-12 w-12 p-0 border-2 border-[#111827] rounded-xl ${
                viewMode === "grid" ? "bg-[#5FB57A] hover:bg-[#4fa66b]" : ""
              }`}
            >
              <Grid className="h-5 w-5" />
            </Button>
            <Button
              variant={viewMode === "list" ? "default" : "outline"}
              onClick={() => setViewMode("list")}
              className={`h-12 w-12 p-0 border-2 border-[#111827] rounded-xl ${
                viewMode === "list" ? "bg-[#5FB57A] hover:bg-[#4fa66b]" : ""
              }`}
            >
              <List className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Active Filters */}
        {allStoresFilters.searchText && (
          <div
            className={`mt-4 flex items-center gap-2 ${
              isRTL ? "flex-row-reverse" : ""
            }`}
          >
            <span className="text-sm text-[#6B7280]">{m.SEARCHING_FOR()}</span>
            <Badge
              variant="secondary"
              className="bg-[#E8F3E8] text-[#111827] border border-[#5FB57A]"
            >
              {allStoresFilters.searchText}
              <button
                onClick={() => allStoresChangeFilters({ searchText: "" })}
                className={`${isRTL ? "mr-2" : "ml-2"} hover:text-[#EF4444]`}
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          </div>
        )}
      </div>

      {/* Loading State */}
      {isLoadingAllStores ? (
        <div
          className={`grid ${
            viewMode === "grid"
              ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
              : "grid-cols-1"
          } gap-6`}
        >
          {[...Array(6)].map((_, i) => (
            <Skeleton key={i} className="h-64 rounded-2xl" />
          ))}
        </div>
      ) : allStores.length === 0 ? (
        /* Empty State */
        <div className="text-center py-16">
          <StoreIcon className="h-16 w-16 text-[#9CA3AF] mx-auto mb-4" />
          <h3
            className="text-xl text-[#111827] mb-2"
            style={{ fontWeight: 600 }}
          >
            {m.NO_STORES_FOUND()}
          </h3>
          <p className="text-[#6B7280]">
            {m.TRY_ADJUSTING_YOUR_SEARCH_OR_FILTERS()}
          </p>
        </div>
      ) : (
        <>
          {/* Stores Grid/List */}
          <div
            className={`grid ${
              viewMode === "grid"
                ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
                : "grid-cols-1"
            } gap-6`}
          >
            {allStores.map((store) => (
              <StoreCard key={store.id} store={store} viewMode={viewMode} />
            ))}
          </div>

          {/* Load More Trigger */}
          {hasMore && (
            <div ref={loadMoreRef} className="mt-8 flex justify-center">
              {isLoadingAllStores && (
                <div className="flex flex-col items-center gap-4">
                  <div className="flex gap-2">
                    <Skeleton className="h-64 w-64 rounded-2xl" />
                    <Skeleton className="h-64 w-64 rounded-2xl hidden md:block" />
                    <Skeleton className="h-64 w-64 rounded-2xl hidden lg:block" />
                  </div>
                </div>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}
