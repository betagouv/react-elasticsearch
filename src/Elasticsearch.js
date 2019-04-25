import React from "react";
import { SharedContextProvider } from "./SharedContextProvider";
import Listener from "./Listener";

// Main component. See storybook for usage.
export default function({ children, url, onChange }) {
  const initialState = { queries: new Map(), results: new Map(), url };

  const reducer = (state, action) => {
    switch (action.type) {
      case "update":
        const { queries } = state;
        queries.set(action.key, action.query);
        return { ...state, queries };
      case "results":
        const { results } = state;
        results.set(action.key, { data: action.data, total: action.total });
        return { ...state, results };
      default:
        return state;
    }
  };

  return (
    <SharedContextProvider initialState={initialState} reducer={reducer}>
      <Listener onChange={onChange}>{children}</Listener>
    </SharedContextProvider>
  );
}
