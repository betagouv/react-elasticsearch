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
          items={data =>
            data.map(({ _source, _score, _id }) => (
              <div key={_id}>
                <b>{_source.TICO}</b> - score: {_score}
              </div>
            ))
          }
        />
      </Elasticsearch>
    );
  })
  .add("with url params", () => <WithUrlParams />)
  .add("movie database", () => {
    return (
      <Elasticsearch
        url={"https://scalr.api.appbase.io/react-elasticsearch-films"}
        headers={{
          Authorization: "Basic " + window.btoa("Qq38oEj7D:a23804f8-f0c4-4dea-9a55-67739275e588")
        }}
      >
        <SearchBox id="main" customQuery={customQueryMovie} />
        <Results
          id="result"
          items={data =>
            data.map(({ _source, _score, _id }) => (
              <div key={_id}>
                <img src={_source.poster_path} />
                <b>
                  {_source.original_title} - {_source.tagline}
                </b>{" "}
                - score: {_score}
              </div>
            ))
          }
        />
      </Elasticsearch>
    );
  });

function WithUrlParams() {
  const [queryString, setQueryString] = useState("");

  const initialValues = fromUrlQueryString("main=%22h%22&resultPage=2");
  return (
    <Elasticsearch
      url={url}
      onChange={values => {
        setQueryString(toUrlQueryString(values));
      }}
    >
      <div>Params: {queryString}</div>
      <SearchBox id="main" fields={["TICO"]} initialValue={initialValues.get("main")} />
      <hr />
      <Facet id="author" fields={["AUTR.keyword"]} />
      <ActiveFilters id="af" />
      <Results
        id="result"
        initialPage={initialValues.get("resultPage")}
        items={data => data.map(({ _source, _id }) => <div key={_id}>{_source.TICO}</div>)}
      />
    </Elasticsearch>
  );
}
