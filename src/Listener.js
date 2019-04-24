import React, { useEffect, useState } from "react";
import { queryFrom, msearch } from "./utils";
import { useSharedContext } from "./SharedContextProvider";

export default function({ onChange, children }) {
  const [{ reactives, url, size, page }, dispatch] = useSharedContext();
  console.log(`DANS LE LISTENENR ${JSON.stringify(Array.from(reactives, ([k, v]) => [k, v.value]))}`)

  useEffect(() => {
    onChange && onChange(new Map(Array.from(reactives, ([k, v]) => [k, v.value])));
  });

  useEffect(() => {
    console.log(JSON.stringify(Array.from(reactives, ([k, v]) => [k, v.value])))
    async function fetchData() {
      const query = queryFrom(Array.from(reactives, ([_k, v]) => v.query(v.value)));
      const result = await msearch(url, { query, size, from: (page - 1) * (size || 10) });
      dispatch({
        type: "setResult",
        data: result.responses[0].hits.hits,
        total: result.responses[0].hits.total
      });
    }
    fetchData();
    return () => {console.log("UNMOUNTED")}
  }, [`${JSON.stringify(Array.from(reactives, ([k, v]) => [k, v.value]))}`, page]);
  return <>{children}</>;
}
