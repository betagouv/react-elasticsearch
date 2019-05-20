import React from "react";
import { storiesOf } from "@storybook/react";
import { Elasticsearch, SearchBox, Results, ActiveFilters, Facet } from "../src";
import { url } from "./utils";
import "../src/style.css";

storiesOf("ActiveFilters", module)
  .add("active", () => {
    return (
      <Elasticsearch url={url}>
        <h1>Display active filters</h1>
        <pre>{`<ActiveFilters id="active-filters" />`}</pre>
        Active Filters:
        <ActiveFilters id="af" />
        <SearchBox id="main" fields={["TICO"]} initialValue={"chemin"} />
        <Facet id="autr" fields={["AUTR.keyword"]} initialValue={["auteur inconnu"]} />
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
  .add("Active filter (change component order)", () => {
    return (
      <Elasticsearch url={url}>
        <h1>Active filter (change component order)</h1>
        <Facet id="autr" fields={["AUTR.keyword"]} />
        Recherche:
        <SearchBox id="main" fields={["TICO"]} initialValue={"chemin"} />
        Filtres:
        <ActiveFilters id="af" />
        <Results
          id="result"
          items={data =>
            data.map(({ _source: s, _id }) => (
              <div key={_id}>
                {s.TICO} - {s.AUTR}
              </div>
            ))
          }
        />
      </Elasticsearch>
    );
  });
