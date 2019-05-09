import React from "react";
import { storiesOf } from "@storybook/react";
import { Elasticsearch, SearchBox, Results, ActiveFilters, Facet } from "../src";
import { url } from "./utils";
import "../src/style.css";

storiesOf("ActiveFilters", module)
  .add("active", () => {
    return (
      <Elasticsearch url={url}>
        <div>
          <div>
            <h1>Display active filters</h1>
            <pre>{`<ActiveFilters id="active-filters" />`}</pre>
            Active Filters:
            <ActiveFilters id="af" />
          </div>
          <div style={{ display: "flex" }}>
            <div>
              <Facet id="autr" fields={["AUTR.keyword"]} initialValue={["auteur inconnu"]} />
            </div>
            <div>
              <SearchBox id="main" fields={["TICO"]} initialValue={"chemin"} />
              <Results
                id="result"
                react={["main", "autr"]}
                item={s => (
                  <div>
                    {s.TICO} - {s.AUTR}
                  </div>
                )}
                pagination={() => <></>}
              />
            </div>
          </div>
        </div>
      </Elasticsearch>
    );
  })
  .add("Active filter (change component order)", () => {
    return (
      <Elasticsearch url={url}>
        <h1>Active filter (change component order)</h1>
        <Facet id="autr" react={["main"]} fields={["AUTR.keyword"]} />
        Recherche:
        <SearchBox id="main" fields={["TICO"]} initialValue={"chemin"} />
        Filtres:
        <ActiveFilters id="af" />
        <Results
          id="result"
          react={["main", "autr"]}
          item={s => (
            <div>
              {s.TICO} - {s.AUTR}
            </div>
          )}
        />
      </Elasticsearch>
    );
  });
