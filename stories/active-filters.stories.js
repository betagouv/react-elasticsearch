import React from "react";
import { storiesOf } from "@storybook/react";
import { Elasticsearch, SearchBox, Results, ActiveFilters, Facet } from "../src";
import { url, headers } from "./utils";
import "../src/style.css";

storiesOf("ActiveFilters", module)
  .add("active", () => {
    return (
      <Elasticsearch url={url} headers={headers}>
        <h1>Display active filters</h1>
        <pre>{`<ActiveFilters id="active-filters" />`}</pre>
        Active Filters:
        <ActiveFilters id="af" />
        <SearchBox id="main" fields={["original_title"]} initialValue={"retour"} />
        <Facet id="lang" fields={["original_language.raw"]} initialValue={["French"]} />
        <Results
          id="result"
          item={s => (
            <div>
              {s.original_title} - {s.original_language}
            </div>
          )}
          pagination={() => <></>}
        />
      </Elasticsearch>
    );
  })
  .add("Active filter (change component order)", () => {
    return (
      <Elasticsearch url={url} headers={headers}>
        <h1>Active filter (change component order)</h1>
        <Facet id="genre" fields={["genres_data.raw"]} />
        Recherche:
        <SearchBox id="main" fields={["original_title"]} initialValue={"war"} />
        Filtres:
        <ActiveFilters id="af" />
        <Results
          id="result"
          item={s => (
            <div>
              {s.original_title} - {Array.isArray(s.genres_data) ? s.genres_data.join(", ") : s.genres_data }
            </div>
          )}
        />
      </Elasticsearch>
    );
  });
