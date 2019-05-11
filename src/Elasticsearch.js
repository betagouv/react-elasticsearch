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
        if (!action.key) {
          console.error("All your components should have an unique Id");
          return state;
        }
        const a = widgets.get(action.key);
        const widget = {
          query: action.query,
          value: action.value,
          react: action.react,
          response: action.response || (a && a.response)
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
