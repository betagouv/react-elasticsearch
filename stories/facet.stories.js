import React, { useState } from "react";
import { storiesOf } from "@storybook/react";
import { Elasticsearch, SearchBox, Results, ActiveFilters, Facet } from "../src";
import { url } from "./utils";

function CollapsableFacet({ initialCollapsed, title, ...rest }) {
  const [collapsed, setCollapsed] = useState(true);

  function FacetWrapper() {
    if (!collapsed) {
      return <Facet {...rest} />;
    }
    return <div />;
  }
  return (
    <div>
      <div>
        {title}
        <button onClick={() => {
          setCollapsed(!collapsed)
        }}>open</button>
      </div>
      {FacetWrapper()}
    </div>
  );
}

storiesOf("Collapsable Facet", module).add("active", () => {
  return (
    <Elasticsearch url={url}>
      <SearchBox id="main" fields={["TICO"]} />
      <CollapsableFacet id="autr" fields={["AUTR.keyword"]} />
      <Results
        id="result"
        item={(s, _t, id) => (
          <div key={id}>
            {s.TICO} - {s.AUTR}
          </div>
        )}
        pagination={() => <></>}
      />
    </Elasticsearch>
  );
});
