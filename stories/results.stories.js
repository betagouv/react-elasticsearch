import React from "react";
import { storiesOf } from "@storybook/react";
import { Elasticsearch, Results } from "../src";
import { url } from "./utils";

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
          item={source => <div>{source.TICO}</div>}
          stats={total => <div style={{ color: "green" }}>{total} results CUSTOM!</div>}
        />
      </Elasticsearch>
    );
  });
