import React from "react";
import { storiesOf } from "@storybook/react";
import { Elasticsearch, SearchBox, Results, CustomWidget } from "../src";
import { url } from "./utils";

function MyComponent({ ctx }) {
  let query;
  if (ctx.widgets.get("main")) {
    query = ctx.widgets.get("main").query
  } else {
    query = "";
  }
  return <div>Main query : {JSON.stringify(query)}</div>;
}

storiesOf("CustomWidget", module).add("active", () => {
  return (
    <Elasticsearch url={url}>
      <SearchBox id="main" fields={["AUTR"]} />
      <CustomWidget>
        <MyComponent />
      </CustomWidget>
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
