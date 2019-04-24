import React, { useState, useEffect } from "react";
import { useSharedContext } from "./SharedContextProvider";

export default function({ customQuery, fields, id }) {
  const [{ reactives }, dispatch] = useSharedContext();
  const current = reactives.get(id);
  const defaultValue = current ? current.value : "";
  const [value, setValue] = useState(defaultValue);

  function queryFromValue(query) {
    if (customQuery) {
      return customQuery(query);
    } else if (fields) {
      return query ? { multi_match: { query, type: "phrase", fields } } : { match_all: {} };
    }
    return [{ match_all: {} }];
  }

  function updateContext(v) {
    dispatch({ type: "update", key: id, query: v => queryFromValue(v), value: v });
    setValue(v);
  }

  // Init values with default
  useEffect(() => {
    if (defaultValue) {
      updateContext(defaultValue);
    }
  }, [defaultValue]);

  return (
    <div className="react-es-searchbox">
      <input type="text" value={value} onChange={e => updateContext(e.target.value)} />
    </div>
  );
}
