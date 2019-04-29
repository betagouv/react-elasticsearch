import React from "react";
import { SharedContextProvider } from "./SharedContextProvider";
import Listener from "./Listener";

// Main component. See storybook for usage.
export default function({ children, url, onChange }) {
  const initialState = {
    /*
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
    */
    //**************/
    url,
    listenerEffect: null,
    // {isSearchComponent}
    widgets: new Map()
  };

  const reducer = (state, action) => {
    // See description above.
    switch (action.type) {
      case "setWidget":
        const widget = {
          needsQuery: action.needsQuery,
          needsConfiguration: action.needsConfiguration,
          isFacet: action.isFacet,
          wantResults: action.wantResults,
          query: action.query,
          value: action.value,
          configuration: action.configuration,
          result: action.result
        };
        const { widgets } = state;
        widgets.set(action.key, widget);
        return { ...state, widgets };
      case "setListenerEffect":
        return { ...state, listenerEffect: action.value };
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
