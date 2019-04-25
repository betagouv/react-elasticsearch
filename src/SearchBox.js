import React, { useState, useEffect } from "react";
import { useSharedContext } from "./SharedContextProvider";

export default function({ customQuery, fields, id, defaultValue, ...rest }) {
  const [{}, dispatch] = useSharedContext();
  const [value, setValue] = useState("");

  // only on call because of []
  useEffect(() => {
    if (defaultValue) {
      setValue(defaultValue);
    }
  }, []);

  function queryFromValue(value) {
    if (customQuery) {
      return customQuery(value);
    } else if (fields) {
      return value ? { multi_match: { query: value, type: "phrase", fields } } : { match_all: {} };
    }
    return { match_all: {} };
  }

  function update(v) {
    setValue(v);
    dispatch({ type: "update", key: id, query: queryFromValue(v), values: v });
  }

  return (
    <div className="react-es-searchbox" {...rest}>
      <input type="text" value={value} onChange={e => update(e.target.value)} />
    </div>
  );
}
