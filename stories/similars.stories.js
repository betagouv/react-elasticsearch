import React, { useEffect } from "react";
import { storiesOf } from "@storybook/react";
import { customQueryMovie, url } from "./utils";
import { Results, SearchBox, Elasticsearch, CustomWidget } from "../src";

export default function getSimilarQuery(job, size = 100) {
  const query = { match_all: {} };
  return query;

  let functions = "";
  functions += `def weight=1;\n`;
  functions += `if(doc['postable'].value == false){ return -1}\n`;
  functions += `if(doc['status.keyword'].value != 'published'){ return -1;}\n`;
  functions += `return weight`;
  const scoreQuery = {
    query: {
      function_score: {
        query: { match_all: {} },
        script_score: { script: { source: functions } }
      }
    },
    size
  };
  return scoreQuery;
}

function MyComponent({ ctx, dispatch }) {
  const { widgets } = ctx;
  const widget = widgets.get("Similar");

  const data = widget && widget.result && widget.result.data ? widget.result.data : [];
  const total = widget && widget.result && widget.result.total ? widget.result.total : 0;

  useEffect(() => {
    const query = getSimilarQuery();
    dispatch({
      type: "setWidget",
      key: "Similar",
      needsQuery: false,
      needsConfiguration: true,
      isFacet: false,
      wantResults: true,
      query,
      value: "SimilarComponent",
      configuration: { itemsPerPage: 3, page: 1, sort: null },
      result: data && total ? { data, total } : null
    });
  }, []);
  return (
    <div>
      MyComponent : {data} {total}
    </div>
  );
}

/*
      type: "setWidget",
      key: id,
      needsQuery: false,
      needsConfiguration: true,
      isFacet: false,
      wantResults: true,
      query: null,
      value: null,
      configuration: { itemsPerPage, page, sort },
      result: data && total ? { data, total } : null
      */

storiesOf("Similar", module)
  .add("basic usage", () => {
    return (
      <Elasticsearch url={url}>
        <SearchBox id="main" />
        <CustomWidget>
          <MyComponent />
        </CustomWidget>
        <Results
          id="result"
          item={(source, score, id) => (
            <div key={id}>
              <img src={source.poster_path} />
              <b>
                {source.original_title} - {source.tagline}
              </b>{" "}
              - score: {score}
            </div>
          )}
        />
        {/* <SearchBox id="main" /> */}
        {/* <Results
        id="result"
        item={(source, score, id) => {
          console.log(source, score, id);
          return (
            <div key={id}>
              <img src={source.poster_path} />
              <b>
                {source.original_title} - {source.tagline}
              </b>{" "}
              <div>{source.release_year}</div>
              <div>{source.genre}</div>
              <div>{source.original_language}</div>
              <div>score: {score}</div>
            </div>
          );
        }}
      /> */}
        <div />
      </Elasticsearch>
    );
  })

  .add("test", () => {
    return (
      <Elasticsearch url={url}>
        <SearchBox id="main" />
        <Results
          id="result"
          item={(source, score, id) => (
            <div key={id}>
              <img src={source.poster_path} />
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
