import React from "react";

import { storiesOf } from "@storybook/react";
import { action } from "@storybook/addon-actions";

import { Pagination, Elasticsearch, SearchBox, Facet, Results } from "../src";

storiesOf("Pagination", module).add("normal", () => {
  return (
    <Pagination
      onChange={action("page changed")}
      total={200}
      itemsPerPage={5}
      currentPage={1}
    />
  );
});

function customQuery(value) {
  if (!value) {
    return { match_all: {} };
  }
  return { multi_match: { query: value, type: "phrase", fields: ["TICO"] } };
}

storiesOf("Elasticsearch", module).add("full", () => {
  return (
    <Elasticsearch url="http://pop-api-staging.eu-west-3.elasticbeanstalk.com/search/merimee">
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
  );
});
