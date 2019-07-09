import React, { useState } from "react";
import { storiesOf } from "@storybook/react";
import { Elasticsearch, QueryBuilder, Results, fromUrlQueryString, toUrlQueryString } from "../src";
import { url } from "./utils";

storiesOf("QueryBuilder", module)
  .add("simple", () => {
    return (
      <Elasticsearch url={url}>
        <QueryBuilder id="qb" fields={[{ value: "AUTR.keyword", text: "Author" }]} />
        <Results
          id="result"
          items={data => data.map(({ _source, _id }) => <div key={_id}>{_source.TICO}</div>)}
        />
      </Elasticsearch>
    );
  })
  .add("autoComplete", () => {
    return (
      <Elasticsearch url={url}>
        <QueryBuilder
          id="qb"
          fields={[{ value: "AUTR.keyword", text: "Author" }]}
          autoComplete={true}
        />
        <Results
          id="result"
          items={data => data.map(({ _source, _id }) => <div key={_id}>{_source.TICO}</div>)}
        />
      </Elasticsearch>
    );
  })
  .add("custom query and operators", () => {
    const regexify = v =>
      `.*${v
        .replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&")
        .replace(/([A-Z])/gi, (_w, x) => `[${x.toUpperCase()}${x.toLowerCase()}]`)}.*`;
    const operators = [
      {
        value: "==",
        text: "contains (case insensitive)",
        useInput: true,
        query: (key, value) => (value ? { regexp: { [key]: regexify(value) } } : null),
        suggestionQuery: (field, value) => {
          return {
            query: { match_all: {} },
            aggs: {
              [field]: {
                terms: { field, include: regexify(value), order: { _count: "desc" }, size: 10 }
              }
            },
            size: 0
          };
        }
      }
    ];
    return (
      <Elasticsearch url={url}>
        <QueryBuilder
          id="qb"
          fields={[{ value: "AUTR.keyword", text: "Author" }]}
          autoComplete={true}
          operators={operators}
        />
        <Results
          id="result"
          items={data => data.map(({ _source, _id }) => <div key={_id}>{_source.TICO}</div>)}
        />
      </Elasticsearch>
    );
  })
  .add("multiple fields", () => {
    return (
      <Elasticsearch url={url}>
        <QueryBuilder
          id="qb"
          fields={[
            { value: "AUTR.keyword", text: "Author" },
            { value: ["AUTR.keyword", "TICO.keyword"], text: "Author + TICO" }
          ]}
          autoComplete={true}
        />
        <Results
          id="result"
          items={data =>
            data.map(({ _source, _id }) => (
              <div key={_id}>
                {_source.AUTR} - {_source.TICO}
              </div>
            ))
          }
        />
      </Elasticsearch>
    );
  })
  .add("listen changes (with url params)", () => <WithUrlParams />);

function WithUrlParams() {
  const [queryString, setQueryString] = useState("");

  const initialValues = fromUrlQueryString(
    "qb=%5B%7B%22field%22%3A%22AUTR.keyword%22%2C%22operator%22%3A%22%2A%22%2C%22value%22%3A%22jean%22%2C%22combinator%22%3A%22AND%22%2C%22index%22%3A0%7D%2C%7B%22field%22%3A%22AUTR.keyword%22%2C%22operator%22%3A%22%2A%22%2C%22value%22%3A%22marc%22%2C%22combinator%22%3A%22OR%22%2C%22index%22%3A1%7D%5D"
  );

  return (
    <Elasticsearch
      url={url}
      onChange={values => {
        setQueryString(toUrlQueryString(values));
      }}
    >
      <div style={{ wordBreak: "break-all" }}>Params: {queryString}</div>
      <QueryBuilder
        initialValue={initialValues.get("qb")}
        id="qb"
        fields={[{ value: "x", text: "Should not be selected" }, { value: "AUTR.keyword", text: "Author" }]}
      />
      <Results
        id="result"
        items={data => data.map(({ _source, _id }) => <div key={_id}>{_source.TICO}</div>)}
      />
    </Elasticsearch>
  );
}
