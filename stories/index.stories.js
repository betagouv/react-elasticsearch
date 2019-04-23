import React from "react";

import { storiesOf } from "@storybook/react";
import { action } from "@storybook/addon-actions";

import { Pagination, Elasticsearch, SearchBox, Facet, Results } from "../src";

const url = "http://pop-api-staging.eu-west-3.elasticbeanstalk.com/search/merimee";

function customQuery(value) {
  if (!value) {
    return { match_all: {} };
  }
  return { multi_match: { query: value, type: "phrase", fields: ["TICO"] } };
}

storiesOf("Elasticsearch", module).add("full", () => {
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
        item={(source, score) => (
          <div>
            <b>{source.TICO}</b> - score: {score}
          </div>
        )}
      />
    </Elasticsearch>
  );
});

storiesOf("SearchBox", module)
  .add("with default query", () => {
    return (
      <Elasticsearch url={url}>
        <h1>Search on AUTR field</h1>
        <pre>{`<SearchBox id="main" fields={["AUTR"]} />`}</pre>
        <SearchBox id="main" fields={["AUTR"]} />
        <Results item={source => <div>{source.TICO}</div>} pagination={() => <></>} />
      </Elasticsearch>
    );
  })
  .add("with custom query", () => {
    return (
      <Elasticsearch url={url}>
        <h1>Search on TICO field with custom query</h1>
        <pre>{`<SearchBox id="main" customQuery={customQuery} />`}</pre>
        <SearchBox id="main" customQuery={customQuery} />
        <Results item={source => <div>{source.TICO}</div>} pagination={() => <></>} />
      </Elasticsearch>
    );
  });

storiesOf("Results", module)
  .add("vanilla", () => {
    return (
      <Elasticsearch url={url}>
        <Results
          item={(source, score, id) => (
            <div>
              <b>{source.TICO}</b> - score: {score} - id: {id}
            </div>
          )}
        />
      </Elasticsearch>
    );
  })
  .add("with custom pagination", () => {
    return (
      <Elasticsearch url={url}>
        <Results
          item={source => <div>{source.TICO}</div>}
          pagination={(total, size, page) => (
            <div style={{ color: "green" }}>
              Total : {total} - Size : {size} - Page: {page} CUSTOM!
            </div>
          )}
        />
      </Elasticsearch>
    );
  })
  .add("with custom stats", () => {
    return (
      <Elasticsearch url={url}>
        <Results
          item={source => <div>{source.TICO}</div>}
          stats={total => <div style={{ color: "green" }}>{total} results CUSTOM!</div>}
        />
      </Elasticsearch>
    );
  });

storiesOf("Pagination", module).add("with various status", () => {
  const paginations = [1, 3, 5, 12, 35, 38, 40].map(i => (
    <div style={{ display: "inline-block", verticalAlign: "top", marginRight: "20px" }} key={i}>
      <h3>On page {i}</h3>
      <Pagination onChange={action("page changed")} total={200} itemsPerPage={5} page={i} />
    </div>
  ));
  return (
    <div>
      {paginations}
      <Pagination onChange={action("page changed")} total={11} itemsPerPage={5} page={1} />
    </div>
  );
});
