import React, { useState } from "react";
import { getStateContext } from "./StateContextProvider";

export default function({ customQuery, id }) {
  const [{ queries }, dispatch] = getStateContext();
  const [value, setValue] = useState();
  return (
    <div style={{ border: "blue 2px solid", margin: "10px" }}>
      <h5>Componsant recherche</h5>
      <input
        type="text"
        value={value}
        onChange={e => {
          setValue(e.target.value);
          dispatch({
            type: "updateQueries",
            key: id,
            value: customQuery(e.target.value),
          });
        }}
      />
      <div>Internal query: {JSON.stringify(queries.get(id))}</div>
    </div>
  );
}
