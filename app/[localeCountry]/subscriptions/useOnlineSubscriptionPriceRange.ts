import { requestFetchSingleOnlineSubscriptionPrice } from "@/network";
import { useEffect, useReducer } from "react";
import { OnlineSubscriptionPrice } from "@/domain-models";

interface State {
  isLoading: boolean;
  data: OnlineSubscriptionPrice[];
  error: unknown;
}

type Action =
  | {
      type: "FETCH_SINGLE_ONLINE_SUBSCRIPTIONS_PRICE_START";
    }
  | {
      type: "FETCH_SINGLE_ONLINE_SUBSCRIPTIONS_PRICE_SUCCESS";
      data: OnlineSubscriptionPrice[];
    }
  | {
      type: "FETCH_SINGLE_ONLINE_SUBSCRIPTIONS_PRICE_ERROR";
      error: unknown;
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
};

const actionHandlers: ActionHandlers = {
  FETCH_SINGLE_ONLINE_SUBSCRIPTIONS_PRICE_START: (state, _action) => ({
    ...state, 
    isLoading: true,
    error: null,
  }),
  FETCH_SINGLE_ONLINE_SUBSCRIPTIONS_PRICE_SUCCESS: (state, { data }) => ({
    ...state,
    isLoading: false,
    data: [...state.data, ...data],
  }),
  FETCH_SINGLE_ONLINE_SUBSCRIPTIONS_PRICE_ERROR: (state, { error }) => ({
    ...state,
    isLoading: false,
    error,
  }),
};

function reducer(state: State = initialState, action: Action): State {
  return actionHandlers[action.type]?.(state, action as any) || state;
}

const useSingleOnlineSubscriptionPrice = ({
  durationId,
  countrySlug,
}: { durationId: string; countrySlug: string }) => {
  const [{ isLoading, data, error }, dispatch] =
    useReducer(reducer, initialState);

  useEffect(() => {
    const controller = new AbortController();

    dispatch({ type: "FETCH_SINGLE_ONLINE_SUBSCRIPTIONS_PRICE_START" });

    requestFetchSingleOnlineSubscriptionPrice({
      durationId,
      countrySlug,
    })
      .then(({ data }) => {
        dispatch({
          type: "FETCH_SINGLE_ONLINE_SUBSCRIPTIONS_PRICE_SUCCESS",
          data,
        });
      })
      .catch((error) => {
        if (controller.signal.aborted) {
          return false;
        }
        dispatch({ type: "FETCH_SINGLE_ONLINE_SUBSCRIPTIONS_PRICE_ERROR", error });
      });

    return () => {
      controller.abort();
    };
    }, [durationId, countrySlug]);

  return {
    isLoadingSingleOnlineSubscriptionPrice: isLoading,
    singleOnlineSubscriptionPrice: data,
    errorLoadingSingleOnlineSubscriptionPrice: error,
  };
};

export { useSingleOnlineSubscriptionPrice };
