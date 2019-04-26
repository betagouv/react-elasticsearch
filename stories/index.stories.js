import React, { useState } from "react";
import { storiesOf } from "@storybook/react";
import {
  Elasticsearch,
  SearchBox,
  Facet,
  Results,
  Listener,
  toUrlQueryString,
  fromUrlQueryString
} from "../src";
import { customQuery, url } from "./utils";

function WithUrlParams() {
  const [queryString, setQueryString] = useState("");

  const initialValues = fromUrlQueryString("main=%22hell%22");
  return (
    <Elasticsearch url={url} onChange={values => { 
      setQueryString(toUrlQueryString(values));
    }}>
      <div>Params: {queryString}</div>
      <SearchBox id="main" customQuery={customQuery} initialValue={initialValues.get("main")} />
      <hr />
      <Facet id="author" fields={["AUTR.keyword"]} />
      <Results id="result" item={(s, _s, id) => <div key={id}>{s.TICO}</div>} />
    </Elasticsearch>
  );
}

storiesOf("Elasticsearch", module)
  .add("basic usage", () => {
    return (
      <Elasticsearch url={url}>
        <SearchBox id="main" customQuery={customQuery} />
        <div style={{ display: "inline-block" }}>
          <Facet id="author" fields={["AUTR.keyword"]} />
        </div>
        <div style={{ display: "inline-block" }}>
          <Facet id="domn" fields={["DOMN.keyword"]} />
        </div>
        <Results
          id="result" 
          item={(source, score, id) => (
            <div key={id}>
              <b>{source.TICO}</b> - score: {score}
            </div>
          )}
        />
      </Elasticsearch>
    );
  })
  .add("with url params", () => <WithUrlParams />);
