import React, { useState } from "react";
import { useSharedContext } from "./SharedContextProvider";

export default function({ customQuery, fields, id }) {
  const [{}, dispatch] = useSharedContext();
  const [value, setValue] = useState("");

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
    dispatch({ type: "update", key: id, query: queryFromValue(v), values: v });
  }

  return (
    <div className="react-es-searchbox">
      <input type="text" value={value} onChange={e => update(e.target.value)} />
    </div>
  );
}
