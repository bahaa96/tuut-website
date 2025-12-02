import { requestFetchAllDeals } from "@/network";
import { useEffect, useReducer } from "react";
import { Deal } from "@/domain-models";

interface State {
  isLoading: boolean;
  data: Deal[];
  error: unknown;
  currentPage: number;
  pageSize: number;
  filters: {
    searchText?: string;
    categoryId?: string;
    storeId?: string;
  };
}

type Action =
  | {
      type: "FETCH_ALL_DEALS_START";
    }
  | {
      type: "FETCH_ALL_DEALS_SUCCESS";
      data: Deal[];
    }
  | {
      type: "FETCH_ALL_DEALS_ERROR";
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
  filters: {},
};

const actionHandlers: ActionHandlers = {
  FETCH_ALL_DEALS_START: (state, _action) => ({
    ...state,
    isLoading: true,
    error: null,
  }),
  FETCH_ALL_DEALS_SUCCESS: (state, { data }) => ({
    ...state,
    isLoading: false,
    data: [...state.data, ...data],
  }),
  FETCH_ALL_DEALS_ERROR: (state, { error }) => ({
    ...state,
    isLoading: false,
    error,
  }),
  CHANGE_PAGE: (state, { page }) => ({
    ...state,
    currentPage: page,
  }),
  CHANGE_FILTERS: (state, { filters }) => ({
    ...state,
    filters: {
      ...state.filters,
      ...filters,
    },
  }),
};

function reducer(state: State = initialState, action: Action): State {
  return actionHandlers[action.type]?.(state, action as any) || state;
}

const useAllDeals = (initialDeals: Deal[]) => {
  const [{ isLoading, data, error, currentPage, pageSize, filters }, dispatch] =
    useReducer(reducer, {
      ...initialState,
      data: initialDeals,
      currentPage: initialDeals.length / initialState.pageSize,
    });

  useEffect(() => {
    const controller = new AbortController();

    dispatch({ type: "FETCH_ALL_DEALS_START" });

    requestFetchAllDeals({
      countrySlug: "EG", // TODO: Replace with country slug
      currentPage: currentPage,
      pageSize: pageSize,
      searchText: filters.searchText,
      categoryId: filters.categoryId,
      storeId: filters.storeId,
    })
      .then(({ data }) => {
        dispatch({
          type: "FETCH_ALL_DEALS_SUCCESS",
          data,
        });
      })
      .catch((error) => {
        if (controller.signal.aborted) {
          return false;
        }
        dispatch({ type: "FETCH_ALL_DEALS_ERROR", error });
      });

    return () => {
      controller.abort();
    };
  }, [currentPage, filters]);

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

  return {
    isLoadingAllDeals: isLoading,
    allDeals: data,
    errorLoadingAllDeals: error,
    allDealsCurrentPage: currentPage,
    allDealsPageSize: pageSize,
    allDealsFilters: filters,
    allDealsChangePage: changePage,
    allDealsChangeFilters: changeFilters,
  };
};

export { useAllDeals };
