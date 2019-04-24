import React, { useEffect } from "react";
import { queryFrom, msearch } from "./utils";
import { useSharedContext } from "./SharedContextProvider";

export default function({ onChange, children }) {
  const [{ reactives, url, size, page }, dispatch] = useSharedContext();

  useEffect(() => {
    onChange && onChange(new Map(Array.from(reactives, ([k, v]) => [k, v.value] )));
  });

  useEffect(() => {
    async function fetchData() {
      const query = queryFrom(Array.from(reactives, ([_k, v]) => v.query(v.value)));
      const result = await msearch(url, { query, size, from: (page - 1) * (size || 10) });
      dispatch({type: "setResult", data: result.responses[0].hits.hits, total: result.responses[0].hits.total})
    }
    fetchData();
  }, [ JSON.stringify(Object.fromEntries(reactives)), page]);
 return <>{children}</>;
}
