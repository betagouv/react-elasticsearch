import React, { useState } from "react";
import { storiesOf } from "@storybook/react";
import { Elasticsearch, QueryBuilder, Results, fromUrlQueryString, toUrlQueryString } from "../src";
import { url } from "./utils";

storiesOf("QueryBuilder", module)
  .add("simple", () => {
    return (
      <Elasticsearch url={url}>
        <QueryBuilder id="qb" fields={[{ value: "AUTR.keyword", text: "Author" }]} />
        <Results id="result" item={(s, _s, id) => <div key={id}>{s.TICO}</div>} />
      </Elasticsearch>
    );
  })
  .add("listen changes (with url params)", () => <WithUrlParams />);

function WithUrlParams() {
  const [queryString, setQueryString] = useState("");

  const initialValues = fromUrlQueryString("qb=%5B%7B%22field%22%3A%22AUTR.keyword%22%2C%22operator%22%3A%22%2A%22%2C%22value%22%3A%22jean%22%2C%22combinator%22%3A%22AND%22%2C%22index%22%3A0%7D%2C%7B%22field%22%3A%22AUTR.keyword%22%2C%22operator%22%3A%22%2A%22%2C%22value%22%3A%22marc%22%2C%22combinator%22%3A%22OR%22%2C%22index%22%3A1%7D%5D");
  console.log(initialValues.get("qb"));
  
  return (
    <Elasticsearch
      url={url}
      onChange={values => {
        setQueryString(toUrlQueryString(values));
      }}
    >
      <div style={{wordBreak: "break-all"}}>Params: {queryString}</div>
      <QueryBuilder initialValue={initialValues.get("qb")} id="qb" fields={[{ value: "AUTR.keyword", text: "Author" }]} />
      <Results id="result" item={(s, _s, id) => <div key={id}>{s.TICO}</div>} />
    </Elasticsearch>
  );
}
