import React, { useEffect, useState } from "react";
import { msearch, toString, queryFrom } from "./utils";
import { useSharedContext } from "./SharedContextProvider";

export default function({ onChange, children }) {
  const [{ reactives, url, size, page }, dispatch] = useSharedContext();
  const [retry, setRetry] = useState(false);

  useEffect(() => {
    onChange && onChange(new Map(Array.from(reactives, ([k, v]) => [k, v.value])));
  });

  // This query watches reactives values (params) and page change
  // in order to perform queries
  useEffect(() => {
    for (let q of reactives.values()) {
      if (!q.query) {
        setRetry(true);
        return;
      }
    }
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
  }, [toString(reactives), page, retry]);
  return <>{children}</>;
}
