import React, { useEffect, useState } from "react";
import { useSharedContext } from "./SharedContextProvider";

export default function({ id }) {
  const [{}, dispatch] = useSharedContext();

  const [sortKey, setSortKey] = useState("DMIS.keyword");
  const [sortOrder, setSortOrder] = useState("desc");

  function createQuery() {
    const query = {
      sort: {},
      query: {
        match_all: {}
      }
    };
    query.sort[sortKey] = { order: sortOrder };
    return query;
  }

  useEffect(() => {
    dispatch({
      type: "setWidget",
      key: id,
      react: null,
      query: createQuery(),
      value: null
    });
  }, [sortOrder, sortKey]);

  return (
    <div className="react-es-sort">
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
    </div>
  );
}
