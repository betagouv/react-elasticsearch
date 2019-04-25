import React from "react";
import { SharedContextProvider } from "./SharedContextProvider";
import Listener from "./Listener";

// Main component. See storybook for usage.
export default function({ children, url, onChange }) {
  const initialState = { 
    // Query slices required by Listener to actually perform 
    // queries (hydrated via search components).
    queries: new Map(), 
    // Results set required by Result components.
    results: new Map(), 
    // Configurations and State about components (page number, 
    // filter value on facet, etc.).
    configurations: new Map(), 
    url 
  };

  const reducer = (state, action) => {
    // See description above.
    switch (action.type) {
      case "setQuery":
        const { queries } = state;
        queries.set(action.key, action.query);
        return { ...state, queries };
      case "setResult":
        const { results } = state;
        results.set(action.key, { data: action.data, total: action.total });
        return { ...state, results };
      case "setConfiguration":
        const { configurations } = state;
        const { key, ...rest } = action;
        configurations.set(key, rest);
        return { ...state, configurations };
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
