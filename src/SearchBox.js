import React, { useState } from "react";
import { useSharedContext } from "./SharedContextProvider";

export default function({ customQuery, id, debug }) {
  const [{ queries }, dispatch] = useSharedContext();
  const [value, setValue] = useState();
  debug && console.log(`SearchBox internal query: ${JSON.stringify(queries.get(id))}`);

  return (
    <div className="react-elasticsearch-searchbox">
      <input
        type="text"
        value={value}
        onChange={e => {
          setValue(e.target.value);
          dispatch({
            type: "updateQueries",
            key: id,
            value: customQuery(e.target.value)
          });
        }}
      />
    </div>
  );
}
