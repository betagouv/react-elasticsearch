import React from "react";
import { storiesOf } from "@storybook/react";
import { Elasticsearch, QueryBuilder, Results } from "../src";
import { url } from "./utils";

storiesOf("QueryBuilder", module).add("active", () => {
  return (
    <Elasticsearch url={url}>
      <QueryBuilder id="qb" fields={[{ value: "AUTR.keyword", text: "Author" }]} />
      <Results id="result" item={(s, _s, id) => <div key={id}>{s.TICO}</div>} />
    </Elasticsearch>
  );
});
