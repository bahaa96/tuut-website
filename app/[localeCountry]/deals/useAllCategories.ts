import { requestFetchAllCategories } from "@/network";
import { useEffect, useReducer } from "react";
import { Category } from "@/domain-models";

interface State {
  isLoading: boolean;
  data: Category[];
  error: unknown;
  currentPage: number;
  pageSize: number;
}

type Action =
  | {
      type: "FETCH_ALL_CATEGORIES_START";
    }
  | {
      type: "FETCH_ALL_CATEGORIES_SUCCESS";
      data: Category[];
    }
  | {
      type: "FETCH_ALL_CATEGORIES_ERROR";
      error: unknown;
    }
  | {
      type: "CHANGE_PAGE";
      page: number;
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
};

const actionHandlers: ActionHandlers = {
  FETCH_ALL_CATEGORIES_START: (state, _action) => ({
    ...state,
    isLoading: true,
    data: [],
    error: null,
  }),
  FETCH_ALL_CATEGORIES_SUCCESS: (state, { data }) => ({
    ...state,
    isLoading: false,
    data,
  }),
  FETCH_ALL_CATEGORIES_ERROR: (state, { error }) => ({
    ...state,
    isLoading: false,
    error,
  }),
  CHANGE_PAGE: (state, { page }) => ({
    ...state,
    currentPage: page,
  }),
};

function reducer(state: State = initialState, action: Action): State {
  return actionHandlers[action.type]?.(state, action as any) || state;
}

const useAllCategories = () => {
  const [{ isLoading, data, error, currentPage, pageSize, filters }, dispatch] =
    useReducer(reducer, initialState);

  useEffect(() => {
    const controller = new AbortController();

    dispatch({ type: "FETCH_ALL_CATEGORIES_START" });

    requestFetchAllCategories({
      countrySlug: "EG", // TODO: Replace with country slug
      currentPage: currentPage,
      pageSize: pageSize,
    })
      .then(({ data }) => {
        dispatch({
          type: "FETCH_ALL_CATEGORIES_SUCCESS",
          data,
        });
      })
      .catch((error) => {
        if (controller.signal.aborted) {
          return false;
        }
        dispatch({ type: "FETCH_ALL_CATEGORIES_ERROR", error });
      });

    return () => {
      controller.abort();
    };
  }, [currentPage, filters]);

  const changePage = (page: number) => {
    dispatch({ type: "CHANGE_PAGE", page });
  };

  return {
    isLoadingAllCategories: isLoading,
    allCategories: data,
    errorLoadingAllCategories: error,
    allCategoriesCurrentPage: currentPage,
    allCategoriesPageSize: pageSize,
    allCategoriesChangePage: changePage,
  };
};

export { useAllCategories };
