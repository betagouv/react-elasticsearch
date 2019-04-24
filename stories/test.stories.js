import React, { useState, useEffect } from "react";
import { storiesOf } from "@storybook/react";
import { SharedContextProvider, useSharedContext } from "../src/SharedContextProvider";

function sleep(ms = 0) {
  return new Promise(r => setTimeout(r, ms));
}

function Wrapper({ params, children }) {
  function r(state, query) {
    return { ...state, params: `PARAM + ${query}` };
  }
  return (
    <SharedContextProvider reducer={r} initialState={{ dp: params, params: "" }}>
      {children}
    </SharedContextProvider>
  );
}

function Search() {
  const [{ dp }, dispatch] = useSharedContext();
  const [query, setQuery] = useState(dp);

  useEffect(() => {
    async function wait() {
      await sleep(1000);
      console.log("EFECT" + query)
      dispatch(query);
    }
    wait();
    return () => {console.log("UNMOUNT")}
  }, [query]);
  return <input onChange={e => setQuery(e.target.value)} value={query} />;
}

function Result() {
  const [{ params }] = useSharedContext();
  return <div>{params}</div>;
}

storiesOf("test", module).add("1", () => {
  return (
    <Wrapper params="hello">
      <Search />
      <Result />
    </Wrapper>
  );
});
