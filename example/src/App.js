import React from "react";
import { Elasticsearch, Results, SearchBox, Facet } from "../dist";

function customQuery(value) {
  if (!value) {
    return { match_all: {} };
  }
  return { multi_match: { query: value, type: "phrase", fields: ["TICO"] } };
}

export default function() {
  return (
    <div>
      <Elasticsearch>
        <SearchBox id="main" customQuery={customQuery} />
        <table>
          <tr>
            <td>
              <Facet id="author" fields={["AUTR.keyword"]} />
            </td>
            <td>
              <Facet id="domn" fields={["DOMN.keyword"]} />
            </td>
          </tr>
        </table>

        <Results />
      </Elasticsearch>
    </div>
  );
}
