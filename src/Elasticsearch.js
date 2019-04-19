import React from "react";
import { StateContextProvider } from "./StateContextProvider";

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
    <StateContextProvider initialState={initialState} reducer={reducer}>
      {children}
    </StateContextProvider>
  );
}
