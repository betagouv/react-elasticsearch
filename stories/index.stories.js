import React, { useState } from "react";
import { storiesOf } from "@storybook/react";
import {
  Elasticsearch,
  SearchBox,
  Facet,
  Results,
  ActiveFilters,
  toUrlQueryString,
  fromUrlQueryString
} from "../src";
import { customQuery, customQueryMovie, url } from "./utils";

storiesOf("Elasticsearch", module)
  .add("basic usage", () => {
    return (
      <Elasticsearch url={url} headers={headers}>
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
              <b>{source.original_title}</b> - score: {score}
            </div>
          )}
        />
      </Elasticsearch>
    );
  })
  .add("with url params", () => <WithUrlParams />)
  .add("movie database", () => {
    return (
      <Elasticsearch
        url={url}
        headers={headers}
      >
        <SearchBox id="main" customQuery={customQueryMovie} />
        <Results
          id="result"
          item={(source, score, id) => (
            <div key={id}>
              <img src={source.poster_path}></img>
              <b>
                {source.original_title} - {source.tagline}
              </b>{" "}
              - score: {score}
            </div>
          )}
        />
      </Elasticsearch>
    );
  });

function WithUrlParams() {
  const [queryString, setQueryString] = useState("");

  const initialValues = fromUrlQueryString("main=%22h%22&resultPage=2");
  return (
    <Elasticsearch
      url={url} headers={headers}
      onChange={values => {
        setQueryString(toUrlQueryString(values));
      }}
    >
      <div>Params: {queryString}</div>
      <SearchBox id="main" fields={["TICO"]}  initialValue={initialValues.get("main")} />
      <hr />
      <Facet id="author" fields={["AUTR.keyword"]} />
      <ActiveFilters id="af" />
      <Results
        id="result"
        initialPage={initialValues.get("resultPage")}
        item={(s, _s, id) => <div key={id}>{s.TICO}</div>}
      />
    </Elasticsearch>
  );
}
