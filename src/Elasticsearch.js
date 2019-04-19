import React from "react";
import { SharedContextProvider } from "./SharedContextProvider";

export default function({ children, url }) {
  const initialState = { queries: new Map(), url };

  const reducer = (state, action) => {
    switch (action.type) {
      case "updateQueries":
        const { queries } = state;
        queries.set(action.key, action.value);
        return { ...state, queries };
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
