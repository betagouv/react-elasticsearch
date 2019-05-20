import React from "react";
import { storiesOf } from "@storybook/react";
import { Elasticsearch, SearchBox, Results } from "../src";
import { customQuery, url } from "./utils";

storiesOf("SearchBox", module)
  .add("with default query", () => {
    return (
      <Elasticsearch url={url}>
        <h1>Search on AUTR field</h1>
        <pre>{`<SearchBox id="main" fields={["AUTR"]} />`}</pre>
        <SearchBox id="main" fields={["AUTR"]} />
        <Results
          id="result"
          items={data =>
            data.map(({ _source: s, _id }) => (
              <div key={_id}>
                {s.TICO} - {s.AUTR}
              </div>
            ))
          }
          pagination={() => <></>}
        />
      </Elasticsearch>
    );
  })
  .add("with custom query", () => {
    return (
      <Elasticsearch url={url}>
        <h1>Search on TICO field with custom query</h1>
        <pre>{`<SearchBox id="main" customQuery={customQuery} />`}</pre>
        <SearchBox id="main" customQuery={customQuery} />
        <Results
          id="result"
          items={data =>
            data.map(({ _source: s, _id }) => (
              <div key={_id}>
                {s.TICO}
              </div>
            ))
          }
          pagination={() => <></>}
        />
      </Elasticsearch>
    );
  });
