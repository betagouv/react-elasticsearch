import React from "react";
import { SharedContextProvider } from "./SharedContextProvider";
import Listener from "./Listener";

// Main component. See storybook for usage.
export default function({ children, url, onChange, headers, ...rest }) {
  const initialState = { url, listenerEffect: null, widgets: new Map(), headers };

  const reducer = (state, action) => {
    const { widgets } = state;
    switch (action.type) {
      case "setWidget":
        const widget = {
          needsQuery: action.needsQuery,
          needsConfiguration: action.needsConfiguration,
          isFacet: action.isFacet,
          query: action.query,
          value: action.value,
          configuration: action.configuration,
          react: action.react,
          response: action.response
        };
        widgets.set(action.key, widget);
        return { ...state, widgets };
      case "deleteWidget":
        widgets.delete(action.key, widget);
        return { ...state, widgets };
      case "setListenerEffect":
        return { ...state, listenerEffect: action.value };
      default:
        return state;
    }
  };

  return (
    <SharedContextProvider initialState={initialState} reducer={reducer}>
      <Listener onChange={onChange} {...rest}>
        {children}
      </Listener>
    </SharedContextProvider>
  );
}
