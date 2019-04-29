import React, { useState } from "react";
import { storiesOf } from "@storybook/react";
import { Elasticsearch, SearchBox, Results } from "../src";
import { customQuery } from "./utils";

const ENDPOINT_URL =
  "https://Qq38oEj7D:a23804f8-f0c4-4dea-9a55-67739275e588@scalr.api.appbase.io/react-elasticsearch-films";
// const READ_ONLY_API_KEY = "Qq38oEj7D:a23804f8-f0c4-4dea-9a55-67739275e588";

storiesOf("Movies", module).add("basic usage", () => {
  return (
    <Elasticsearch url={ENDPOINT_URL}>
      <SearchBox id="main" customQuery={customQuery} />
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
});
