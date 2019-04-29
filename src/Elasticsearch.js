import React from "react";
import { SharedContextProvider } from "./SharedContextProvider";
import Listener from "./Listener";
import { defer } from "./utils";

// Main component. See storybook for usage.
export default function({ children, url, onChange }) {
  const initialState = {
    // These 4 Maps are about subcomponents properties.
    // Each key reprensent a component by its ID. It could
    // have been one map, but harder to update+consume separatly.
    //
    // Query slices required by Listener to actually perform
    // queries (hydrated via search components).
    queries: new Map(),
    // Results set required by Result components.
    results: new Map(),
    // Configurations and State about components (page number,
    // filter value on facet, etc.).
    configurations: new Map(),
    // Values of components, like "my search phrase"
    values: new Map(),
    // The URL of the component
    url,
    searchComponents: new Map(),
    resultComponents: new Map(),
    facetComponents: new Map(),
    configurableComponents: new Map(),
    bigThing: null,
  };

  const reducer = (state, action) => {
    // See description above.
    switch (action.type) {
      case "setBigThing":
        return { ...state, bigThing: action.value };
      case "setSearchComponents":
        const { searchComponents } = state;
        searchComponents.set(action.key, action.key);
        return { ...state, searchComponents };
      case "setResultComponents":
        const { resultComponents } = state;
        resultComponents.set(action.key, action.key);
        return { ...state, resultComponents };
      case "setFacetComponents":
        const { facetComponents } = state;
        facetComponents.set(action.key, action.key);
        return { ...state, facetComponents };
      case "setConfigurableComponents":
        const { configurableComponents } = state;
        configurableComponents.set(action.key, action.key);
        return { ...state, configurableComponents };
      case "setQuery":
        const { queries, values } = state;
        queries.set(action.key, action.query);
        values.set(action.key, action.value);
        return { ...state, queries, values };
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
