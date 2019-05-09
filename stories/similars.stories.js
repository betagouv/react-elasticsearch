import React, { useEffect } from "react";
import { storiesOf } from "@storybook/react";
import { customQueryMovie, url } from "./utils";
import { Results, SearchBox, Elasticsearch, CustomWidget, Facet } from "../src";

export default function getSimilarQuery(job, size = 100) {
  const query = { query: { match_all: {} } };
  return query;

  // let functions = "";
  // functions += `def weight=1;\n`;
  // functions += `if(doc['postable'].value == false){ return -1}\n`;
  // functions += `if(doc['status.keyword'].value != 'published'){ return -1;}\n`;
  // functions += `return weight`;
  // const scoreQuery = {
  //   query: {
  //     function_score: {
  //       query: { match_all: {} },
  //       script_score: { script: { source: functions } }
  //     }
  //   },
  //   size
  // };
  // return scoreQuery;
}

function MyComponent({ ctx, dispatch, updateQuery, onData, onAggr }) {
  const { widgets } = ctx;
  const widget = widgets.get("Similar");

  console.log(widget);

  const data = widget && widget.result && widget.result.data ? widget.result.data : [];
  const total = widget && widget.result && widget.result.total ? widget.result.total : 0;

  useEffect(() => {
    const query = getSimilarQuery();
    dispatch({
      type: "setWidget",
      key: "Similar",
      needsQuery: false,
      needsConfiguration: true,
      isFacet: false,
      wantResults: true,
      query,
      value: "SimilarComponent",
      configuration: { itemsPerPage: 3, page: 1, sort: null },
      result: data && total ? { data, total } : null,
      react: ["main"]
    });
  }, []);

  const arr = data.map(e => <div key={e._id}>{`${e._source.TICO} (${e._score})`}</div>);
  return (
    <div>
      MyComponent : {total}
      <div>{arr}</div>
    </div>
  );
}

storiesOf("Similar", module).add("basic usage", () => {
  return (
    <Elasticsearch url={url}>
      <div>TODO</div>
    </Elasticsearch>
  );
});
