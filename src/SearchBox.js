import React, { useState } from "react";
import { useSharedContext } from "./SharedContextProvider";

export default function({ customQuery, id }) {
  const [{}, dispatch] = useSharedContext();
  const [value, setValue] = useState();

  return (
    <div className="react-elasticsearch-searchbox">
      <input
        type="text"
        value={value}
        onChange={e => {
          setValue(e.target.value);
          dispatch({ type: "updateQueries", key: id, value: customQuery(e.target.value) });
        }}
      />
    </div>
  );
}
