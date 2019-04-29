import React, { useEffect } from "react";
import { storiesOf } from "@storybook/react";
import { SharedContextProvider, useSharedContext } from "../src/SharedContextProvider";

function flatChildren(arr, initial) {
  return arr.reduce((accumulator, current) => {
    if (React.isValidElement(current) && current.props.children) {
      return flatChildren(React.Children.toArray(current.props.children), [
        ...accumulator,
        current
      ]);
    }
    return [...accumulator, current];
  }, initial || []);
}

function Parent({ children }) {
  function flatChildren(arr, initial) {
    return arr.reduce((accumulator, current) => {
      if (React.isValidElement(current) && current.props.children) {
        return flatChildren(React.Children.toArray(current.props.children), [
          ...accumulator,
          current
        ]);
      }
      return [...accumulator, current];
    }, initial || []);
  }
  return <div>Total children: {flatChildren(React.Children.toArray(children)).length}</div>;
}

function Child() {
  return (
    <div>
      <span>test</span>
    </div>
  );
}

const resolved = Promise.resolve();
const defer = f => {
  resolved.then(f);
};

storiesOf("flatChildren", module)
  .add("flatChildren", () => {
    return (
      <div>
        <Parent>
          <div>
            <span>test</span>
          </div>
        </Parent>
        <Parent>
          <Child />
        </Parent>
      </div>
    );
  })
  .add("effect order", () => {
    const Enfant = () => {
      const [{}, dispatch] = useSharedContext();
      useEffect(() => {
        console.log(Math.random(), "child effect");
        dispatch({ action: Math.random() });
      }, []);
      return <span>loilol</span>;
    };

    const Listener = ({ children }) => {
      const [{}, dispatch] = useSharedContext();
      useEffect(() => {
        console.log(Math.random(), "Listener effect");
        defer(() => console.log(Math.random(), "tout est fini"));
      });
      console.log(Math.random(), "Listener render");
      return <>{children}</>;
    };

    const Papa = ({ children }) => {
      const reducer = (state, action) => {
        console.log(Math.random(), "REDUCED", action);
        console.log([...state.lol, action.action]);
        
        return { ...state, lol: [...state.lol, action.action] };
      };
      return (
        <SharedContextProvider initialState={{ lol: [] }} reducer={reducer}>
          <Listener>{children}</Listener>
        </SharedContextProvider>
      );
    };

    return (
      <Papa>
        <Enfant />
        <Enfant />
        <Enfant />
        <Enfant />
        <Enfant />
        <div>
          <div>
            <Enfant />
          </div>
        </div>
      </Papa>
    );
  });
