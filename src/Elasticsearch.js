import React from "react";
import { StateContextProvider } from "./StateContextProvider";

export default function(props) {
  const initialState = {
    queries: new Map()
  };

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
      <h4>COmposant principal</h4>
      <div style={{ border: "red 2px solid" }}>{props.children}</div>
    </StateContextProvider>
  );
}
