import { requestFetchAllStores } from "@/network";
import { useEffect, useReducer, useState } from "react";
import { Store } from "@/domain-models";
import { usePathname } from "next/navigation";

interface State {
  isLoading: boolean;
  data: Store[];
  error: unknown;
  currentPage: number;
  pageSize: number;
  isLoadingMore: boolean;
  filters: {
    searchText?: string;
    categoryId?: string;
    storeId?: string;
  };
}

type Action =
  | {
      type: "FETCH_ALL_START";
    }
  | {
      type: "FETCH_ALL_SUCCESS";
      data: Store[];
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
        storeId?: string;
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
      data: Store[];
    };
type ActionHandlers = {
  [key in Action["type"]]: (
    state: State,
    action: Extract<Action, { type: key }>
  ) => State;
};

const initialState: State = {
  isLoading: false,
  data: [],
  error: null,
  currentPage: 1,
  pageSize: 10,
  isLoadingMore: false,
  filters: {},
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
  CHANGE_PAGE: (state, { page }) => ({
    ...state,
    currentPage: page,
    isLoadingMore: true,
  }),
  CHANGE_FILTERS: (state, { filters }) => ({
    ...state,
    filters: {
      ...state.filters,
      ...filters,
    },
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

const useAllStores = (initialStores: Store[]) => {
  const [
    { isLoading, data, error, currentPage, pageSize, filters, isLoadingMore },
    dispatch,
  ] = useReducer(reducer, {
    ...initialState,
    data: initialStores,
    currentPage: initialStores.length / initialState.pageSize,
  });
  const [refetchTrigger, setRefetchTrigger] = useState({});

  const localeCountry = usePathname()?.split("/")[1];

  const countrySlug = localeCountry?.split("-")[1];

  useEffect(() => {
    if (!countrySlug) return;

    const controller = new AbortController();

    dispatch({ type: "FETCH_ALL_START" });

    requestFetchAllStores({
      countrySlug,
      currentPage: currentPage,
      pageSize: pageSize,
      searchText: filters.searchText,
      categoryId: filters.categoryId,
      storeId: filters.storeId,
    })
      .then(({ data }) => {
        dispatch({
          type: "FETCH_ALL_SUCCESS",
          data,
        });
      })
      .catch((error) => {
        if (controller.signal.aborted) {
          return false;
        }
        dispatch({ type: "FETCH_ALL_ERROR", error });
      });

    return () => {
      controller.abort();
    };
  }, [filters, refetchTrigger]);

  useEffect(() => {
    if (!countrySlug) return;

    const controller = new AbortController();

    dispatch({ type: "LOADING_MORE_START" });
    requestFetchAllStores({
      countrySlug,
      currentPage: currentPage,
      pageSize: pageSize,
      searchText: filters.searchText,
      categoryId: filters.categoryId,
      storeId: filters.storeId,
    })
      .then(({ data }) => {
        dispatch({
          type: "LOADING_MORE_SUCCESS",
          data,
        });
      })
      .catch((error) => {
        dispatch({ type: "LOADING_MORE_ERROR", error });
      });

    return () => {
      controller.abort();
    };
  }, [currentPage]);

  const changePage = (page: number) => {
    dispatch({ type: "CHANGE_PAGE", page });
  };

  const changeFilters = (filters: {
    searchText?: string;
    categoryId?: string;
    storeId?: string;
  }) => {
    dispatch({ type: "CHANGE_FILTERS", filters });
  };

  const refetch = () => {
    setRefetchTrigger({});
  };

  return {
    isLoadingAllStores: isLoading,
    allStores: data,
    errorLoadingAllStores: error,
    allStoresCurrentPage: currentPage,
    allStoresPageSize: pageSize,
    allStoresFilters: filters,
    isAllStoresLoadingMore: isLoadingMore,
    allStoresChangePage: changePage,
    allStoresChangeFilters: changeFilters,
    refetchAllStores: refetch,
  };
};

export { useAllStores };
