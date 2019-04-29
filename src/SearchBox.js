import React, { useState, useEffect } from "react";
import { useSharedContext } from "./SharedContextProvider";

export default function({ customQuery, fields, id, initialValue }) {
  const [{}, dispatch] = useSharedContext();
  const [value, setValue] = useState(initialValue || "");

  // Update external query on mount.
  useEffect(() => {
    update(value);
  }, []);

  // Build a query from a value
  function queryFromValue(query) {
    if (customQuery) {
      return customQuery(query);
    } else if (fields) {
      return query ? { multi_match: { query, type: "phrase", fields } } : { match_all: {} };
    }
    return { match_all: {} };
  }

  function update(v) {
    setValue(v);
    dispatch({
      type: "setWidget",
      key: id,
      needsQuery: true,
      needsConfiguration: false,
      isFacet: false,
      wantResults: false,
      query: queryFromValue(v),
      value: v,
      configuration: null,
      result: null
    });
  }

  return (
    <div className="react-es-searchbox">
      <input type="text" value={value} onChange={e => update(e.target.value)} />
    </div>
  );
}
