import React from "react";
import { storiesOf } from "@storybook/react";
import { Elasticsearch, Results } from "../src";
import { url } from "./utils";

storiesOf("Results", module)
  .add("vanilla", () => {
    return (
      <Elasticsearch url={url}>
        <Results
          id="result"
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
          id="result"
          item={source => <div>{source.TICO}</div>}
          pagination={(total, itemsPerPage, page) => (
            <div style={{ color: "green" }}>
              Total : {total} - ItemsPerPage : {itemsPerPage} - Page: {page} CUSTOM!
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
          id="result"
          item={source => <div>{source.TICO}</div>}
          stats={total => <div style={{ color: "green" }}>{total} results CUSTOM!</div>}
        />
      </Elasticsearch>
    );
  })
  .add("sortable (DMIS desc)", () => {
    return (
      <Elasticsearch url={url}>
      <h1>Sorted by DMIS</h1>
      <pre>{`<Results id="x" sort={[{ "DMIS.keyword": { order: "desc" } }]} />`}</pre>
        <Results
          id="result"
          sort={[{ "DMIS.keyword": { order: "desc" } }]}
          item={source => (
            <div>
              {source.DMIS} - {source.TICO.substr(0, 50)}
            </div>
          )}
        />
      </Elasticsearch>
    );
  });
