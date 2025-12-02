import { requestFetchAllStores } from "@/network";
import { useEffect, useReducer } from "react";
import { Store } from "@/domain-models";

interface State {
  isLoading: boolean;
  data: Store[];
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
      type: "FETCH_ALL_STORES_START";
    }
  | {
      type: "FETCH_ALL_STORES_SUCCESS";
      data: Store[];
    }
  | {
      type: "FETCH_ALL_STORES_ERROR";
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
  FETCH_ALL_STORES_START: (state, _action) => ({
    ...state,
    isLoading: true,
    data: [],
    error: null,
  }),
  FETCH_ALL_STORES_SUCCESS: (state, { data }) => ({
    ...state,
    isLoading: false,
    data,
  }),
  FETCH_ALL_STORES_ERROR: (state, { error }) => ({
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

const useAllStores = () => {
  const [{ isLoading, data, error, currentPage, pageSize, filters }, dispatch] =
    useReducer(reducer, initialState);

  useEffect(() => {
    const controller = new AbortController();

    dispatch({ type: "FETCH_ALL_STORES_START" });

    requestFetchAllStores({
      countrySlug: "EG", // TODO: Replace with country slug
      currentPage: currentPage,
      pageSize: pageSize,
    })
      .then(({ data }) => {
        dispatch({
          type: "FETCH_ALL_STORES_SUCCESS",
          data,
        });
      })
      .catch((error) => {
        if (controller.signal.aborted) {
          return false;
        }
        dispatch({ type: "FETCH_ALL_STORES_ERROR", error });
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
    isLoadingAllStores: isLoading,
    allStores: data,
    errorLoadingAllStores: error,
    allStoresCurrentPage: currentPage,
    allStoresPageSize: pageSize,
    allStoresFilters: filters,
    allStoresChangePage: changePage,
    allStoresChangeFilters: changeFilters,
  };
};

export { useAllStores };
