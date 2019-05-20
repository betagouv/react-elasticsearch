import React, { useState } from "react";
import { storiesOf } from "@storybook/react";
import { Elasticsearch, SearchBox, Results, Facet } from "../src";
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
        <button
          onClick={() => {
            setCollapsed(!collapsed);
          }}
        >
          open
        </button>
      </div>
      {FacetWrapper()}
    </div>
  );
}

storiesOf("Facet", module)
  .add("collapsable", () => {
    return (
      <Elasticsearch url={url}>
        <SearchBox id="main" fields={["TICO"]} />
        <CollapsableFacet id="autr" fields={["AUTR.keyword"]} />
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
  .add("customized", () => {
    return (
      <Elasticsearch url={url}>
        <Facet
          seeMore="SEE MORE CUSTOM"
          placeholder="MY PLACEHOLDER"
          id="autr"
          fields={["AUTR.keyword"]}
          itemsPerBlock={10}
        />
        <Results
          id="result"
          items={data =>
            data.map(({ _source, _id, _score }) => (
              <div key={_id}>
                {_source.TICO} - score: {_score}
              </div>
            ))
          }
        />
      </Elasticsearch>
    );
  })
  .add("modify filter value", () => {
    return (
      <Elasticsearch url={url}>
        <Facet
          filterValueModifier={v => `${v}.*`}
          placeholder="type first letters"
          id="autr"
          fields={["AUTR.keyword"]}
        />
        <Results
          id="result"
          items={data =>
            data.map(({ _source, _id, _score }) => (
              <div key={_id}>
                {_source.TICO} - score: {_score}
              </div>
            ))
          }
        />
      </Elasticsearch>
    );
  })
  .add("facet with custom render items", () => {
    return (
      <Elasticsearch url={url}>
        <SearchBox id="main" fields={["TICO"]} />
        <Facet
          id="autr"
          fields={["AUTR.keyword"]}
          items={(data, { handleChange, isChecked }) => {
            return data.map(item => (
              <div
                style={{ color: isChecked(item) ? "green" : "black" }}
                onClick={() => handleChange(item, !isChecked(item))}
              >
                -> {item.key}
              </div>
            ));
          }}
        />
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
  });
