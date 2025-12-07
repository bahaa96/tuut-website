import { Product } from "@/domain-models/Product";
import { requestFetchAllProducts } from "@/network/products";
import { useReducer, useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

interface State {
  isLoading: boolean;
  data: Product[];
  error: unknown;
  currentPage: number;
  pageSize: number;
  isLoadingMore: boolean;
  hasMore: boolean;
  filters: {
    searchText?: string;
    categoryId?: string;
  };
}

const initialState: State = {
  isLoading: false,
  data: [],
  error: null,
  currentPage: 1,
  pageSize: 10,
  isLoadingMore: false,
  hasMore: true,
  filters: {},
};

type Action =
  | {
      type: "FETCH_ALL_START";
    }
  | {
      type: "FETCH_ALL_SUCCESS";
      data: Product[];
    }
  | {
      type: "FETCH_ALL_ERROR";
      error: unknown;
    }
  | {
      type: "CHANGE_PAGE";
      page: number;
    }
  | {
      type: "CHANGE_FILTERS";
      filters: {
        searchText?: string;
        categoryId?: string;
      };
    }
  | {
      type: "LOADING_MORE_START";
    }
  | {
      type: "LOADING_MORE_ERROR";
      error: unknown;
    }
  | {
      type: "LOADING_MORE_SUCCESS";
      data: Product[];
    };

type ActionHandlers = {
  [key in Action["type"]]: (
    state: State,
    action: Extract<Action, { type: key }>
  ) => State;
};

const actionHandlers: ActionHandlers = {
  FETCH_ALL_START: (state, _action) => ({
    ...state,
    isLoading: true,
    error: null,
  }),
  FETCH_ALL_SUCCESS: (state, { data }) => ({
    ...state,
    isLoading: false,
    data,
  }),
  FETCH_ALL_ERROR: (state, { error }) => ({
    ...state,
    isLoading: false,
    error,
  }),
  CHANGE_PAGE: (state, { page }) => ({ ...state, currentPage: page }),
  CHANGE_FILTERS: (state, { filters }) => ({
    ...state,
    filters: { ...state.filters, ...filters },
  }),
  LOADING_MORE_START: (state, _action) => ({
    ...state,
    isLoadingMore: true,
    error: null,
  }),
  LOADING_MORE_ERROR: (state, { error }) => ({
    ...state,
    isLoadingMore: false,
    error,
  }),
  LOADING_MORE_SUCCESS: (state, { data }) => ({
    ...state,
    isLoadingMore: false,
    data: [...state.data, ...data],
  }),
};

function reducer(state: State = initialState, action: Action): State {
  return actionHandlers[action.type]?.(state, action as any) || state;
}

const INITIAL_PRODUCTS_COUNT = 50;

const useAllProducts = (initialProducts: Product[]) => {
  const hasInitialProducts = initialProducts && initialProducts.length > 0;
  const initialPage = hasInitialProducts ? 1 : 0;

  const [
    { isLoading, data, error, currentPage, pageSize, filters, isLoadingMore },
    dispatch,
  ] = useReducer(reducer, {
    ...initialState,
    data: initialProducts || [],
    currentPage: initialPage,
    pageSize: INITIAL_PRODUCTS_COUNT,
  });

  const localeCountry = usePathname()?.split("/")[1];
  const countrySlug = localeCountry?.split("-")[1];
  const locale = localeCountry?.split("-")[0];

  // Track if we've already loaded the first page
  const isFirstPageLoadedRef = useRef(hasInitialProducts);

  useEffect(() => {
    if (!filters.searchText && !filters.categoryId) {
      return;
    }

    const controller = new AbortController();

    dispatch({ type: "FETCH_ALL_START" });

    requestFetchAllProducts({
      countrySlug: countrySlug as string,
      currentPage: 1, // Always start from page 1 when filters change
      pageSize,
      searchText: filters.searchText,
      categoryId: filters.categoryId,
      language: locale,
    })
      .then(({ data }) => {
        dispatch({ type: "FETCH_ALL_SUCCESS", data });
      })
      .catch((error) => {
        if (controller.signal.aborted) {
          return; // Silently handle abort
        }
        dispatch({ type: "FETCH_ALL_ERROR", error });
      });

    return () => {
      controller.abort();
    };
  }, [filters, countrySlug, locale]);

  useEffect(() => {
    // Don't fetch if:
    // - We're on page 0 or 1 and already have initial products
    // - currentPage is less than or equal to 1 when we have initial products
    if ((hasInitialProducts && currentPage <= 1) || currentPage === 0) {
      return;
    }

    const controller = new AbortController();

    dispatch({ type: "LOADING_MORE_START" });

    requestFetchAllProducts({
      countrySlug: countrySlug as string,
      currentPage,
      pageSize,
      searchText: filters.searchText,
      categoryId: filters.categoryId,
      language: locale,
      options: {
        abortSignal: controller.signal,
      },
    })
      .then(({ data }) => {
        dispatch({ type: "LOADING_MORE_SUCCESS", data });
      })
      .catch((error) => {
        if (controller.signal.aborted) {
          return; // Silently handle abort
        }
        dispatch({ type: "LOADING_MORE_ERROR", error });
      });

    return () => {
      controller.abort();
    };
  }, [currentPage, hasInitialProducts]);

  const changePage = (page: number) => {
    dispatch({ type: "CHANGE_PAGE", page });
  };

  const changeFilters = (filters: {
    searchText?: string;
    categoryId?: string;
  }) => {
    // Reset to page 1 when filters change
    dispatch({ type: "CHANGE_PAGE", page: 1 });
    dispatch({ type: "CHANGE_FILTERS", filters });
  };

  return {
    isLoadingAllProducts: isLoading,
    allProducts: data,
    errorLoadingAllProducts: error,
    allProductsCurrentPage: currentPage,
    allProductsPageSize: pageSize,
    allProductsFilters: filters,
    isAllProductsLoadingMore: isLoadingMore,
    allProductsChangePage: changePage,
    allProductsChangeFilters: changeFilters,
  };
};

export default useAllProducts;
