import React, { useState } from "react";
import { useSharedContext } from "./SharedContextProvider";

export default function({ customQuery, fields, id }) {
  const [{}, dispatch] = useSharedContext();
  const [value, setValue] = useState();

  function queryFromValue(query) {
    if (customQuery) {
      return customQuery(query);
    } else if (fields) {
      return query ? { multi_match: { query, type: "phrase", fields } } : { match_all: {} };
    }
    return { match_all: {} };
  }

  return (
    <div className="react-elasticsearch-searchbox">
      <input
        type="text"
        value={value}
        onChange={e => {
          setValue(e.target.value);
          dispatch({ type: "updateQueries", key: id, value: queryFromValue(e.target.value) });
        }}
      />
    </div>
  );
}
