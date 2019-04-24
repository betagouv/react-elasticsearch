import React, { useState, useEffect } from "react";
import { useSharedContext } from "./SharedContextProvider";

export default function({ customQuery, fields, id }) {
  const [{ defaultParams }, dispatch] = useSharedContext();
  const defaultValue = defaultParams.get(id) || "";
  const [value, setValue] = useState(defaultValue);

  useEffect(() => {
    update(defaultValue);
  }, [defaultValue]);

  function queryFromValue(query) {
    if (customQuery) {
      return customQuery(query);
    } else if (fields) {
      return query ? { multi_match: { query, type: "phrase", fields } } : { match_all: {} };
    }
    return [{ match_all: {} }];
  }

  function update(v) {
    dispatch({ type: "update", key: id, query: v => queryFromValue(v), value: v });
    setValue(v);
  }

  return (
    <div className="react-es-searchbox">
      <input type="text" value={value} onChange={e => update(e.target.value)} />
    </div>
  );
}
