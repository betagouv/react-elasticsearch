import React from "react";
import { SharedContextProvider } from "./SharedContextProvider";
import Listener from "./Listener";

// Main component. See storybook for usage.
export default function({ children, url, onChange, defaultParams }) {
  console.log(defaultParams, new Map([["main", {value: "bourg"}]]))
  const initialState = {
    reactives: defaultParams || new Map(),
    result: null,
    page: 1,
    // defaultParams: defaultParams || new Map(),
    url
  };

  const reducer = (state, action) => {
    switch (action.type) {
      case "update":
        const { reactives } = state;
        const { query, value, key } = action;
        reactives.set(key, { query, value });
        return { ...state, reactives };
      case "setResult":
        return { ...state, result: { total: action.total, data: action.data } };
      case "setPage":
        return { ...state, page: action.page };
      default:
        return state;
    }
  };

  return (
    <SharedContextProvider initialState={initialState} reducer={reducer}>
      <Listener onChange={onChange} defaultParams={defaultParams}>
        {children}
      </Listener>
    </SharedContextProvider>
  );
}
