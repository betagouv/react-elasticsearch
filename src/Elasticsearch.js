import React from "react";
import { SharedContextProvider } from "./SharedContextProvider";

// Main component. See storybook for usage.
export default function({ children, url }) {
  const initialState = { queries: new Map(), params: new Map(), url };

  const reducer = (state, action) => {
    switch (action.type) {
      case "update":
        const { queries, params } = state;
        queries.set(action.key, action.query);
        params.set(action.key, action.values);
        return { ...state, queries, params };
      default:
        return state;
    }
  };

  return (
    <SharedContextProvider initialState={initialState} reducer={reducer}>
      {children}
    </SharedContextProvider>
  );
}
