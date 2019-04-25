import React, { useEffect, useMemo } from "react";
import { storiesOf } from "@storybook/react";
import { SharedContextProvider, useSharedContext } from "../src/SharedContextProvider";

function Parent({ children }) {
  const initialState = { queries: [] };
  const reducer = (state, action) => {
    switch (action.type) {
      case "setQuery":
        const { queries } = state;
        queries.push(action.query);
        return { ...state, queries };
      default:
        return state;
    }
  };

  return (
    <SharedContextProvider initialState={initialState} reducer={reducer}>
      <Listener>{children}</Listener>
    </SharedContextProvider>
  );
}

function Listener({ children }) {
  const [{ queries }] = useSharedContext();
  useEffect(() => {
    function flatChildren(arr, initial) {
      return arr.reduce((accumulator, current) => {
        if (!React.isValidElement(current)) {
          return current;
        }
        if (current.props.children) {
          return flatChildren(React.Children.toArray(current.props.children), [
            ...accumulator,
            current
          ]);
        }
        return [...accumulator, current];
      }, initial || []);
    }

    const childNumber = flatChildren(React.Children.toArray(children)).filter(e => e.type === Child).length
    if (queries.length === childNumber) {
      console.log("pret ?", queries);
    }
  });
  return <>{children}</>;
}

function Child({}) {
  const [{}, dispatch] = useSharedContext();
  useEffect(() => {
    dispatch({ type: "setQuery", query: Math.random() });
  }, []);
  return <div>{Math.random()}</div>;
}

storiesOf("test", module).add("test", () => {
  return (
    <Parent>
      <Child />
      <Child />
      <Child />
      <div>
        <Child />
        <Child />
      </div>
    </Parent>
  );
});
