import React, { useState, useEffect } from "react";
import { storiesOf } from "@storybook/react";
import { Elasticsearch, Results } from "../src";
import { url } from "./utils";

storiesOf("Results", module)
  .add("vanilla", () => {
    return (
      <Elasticsearch url={url}>
        <Results
          id="result"
          item={(source, score, id) => (
            <div>
              <b>{source.TICO}</b> - score: {score} - id: {id}
            </div>
          )}
        />
      </Elasticsearch>
    );
  })
  .add("with custom pagination", () => {
    return (
      <Elasticsearch url={url}>
        <Results
          id="result"
          item={source => <div>{source.TICO}</div>}
          pagination={(total, itemsPerPage, page) => (
            <div style={{ color: "green" }}>
              Total : {total} - ItemsPerPage : {itemsPerPage} - Page: {page} CUSTOM!
            </div>
          )}
        />
      </Elasticsearch>
    );
  })
  .add("with custom stats", () => {
    return (
      <Elasticsearch url={url}>
        <Results
          id="result"
          item={source => <div>{source.TICO}</div>}
          stats={total => <div style={{ color: "green" }}>{total} results CUSTOM!</div>}
        />
      </Elasticsearch>
    );
  })
  .add("sortable (DMIS desc)", () => <WithSortable />);

function WithSortable() {
  const [sortKey, setSortKey] = useState("DMIS.keyword");
  const [sortOrder, setSortOrder] = useState("desc");
  const [sortQuery, setSortQuery] = useState([{ [sortKey]: { order: sortOrder } }]);

  useEffect(() => {
    setSortQuery([{ [sortKey]: { order: sortOrder } }]);
  }, [sortKey, sortOrder]);

  return (
    <Elasticsearch url={url}>
      Sort by:{" "}
      <select onChange={e => setSortKey(e.target.value)} value={sortKey}>
        {["AUTR.keyword", "DMIS.keyword", "DMAJ.keyword", "TICO.keyword"].map(e => (
          <option key={e} value={e}>
            {e.replace(".keyword", "")}
          </option>
        ))}
      </select>
      <select onChange={e => setSortOrder(e.target.value)} value={sortOrder}>
        <option value="asc">asc</option>
        <option value="desc">desc</option>
      </select>
      <Results
        id="result"
        sort={sortQuery}
        item={source => (
          <div>
            {source.DMIS} - {source.TICO.substr(0, 50)}
          </div>
        )}
      />
    </Elasticsearch>
  );
}
