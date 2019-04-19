import React, { useEffect, useState } from "react";
import { msearch, queryFrom } from "./utils";
import { useSharedContext } from "./SharedContextProvider";
import Pagination from "./Pagination";

// Pagination, informations about results (like "30 results") 
// and size (number items per page) are customizable.
export default function({ size, pagination, resultsInfo }) {
  const [{ queries, url }] = useSharedContext();
  const [data, setData] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const query = queryFrom(queries);
  size = size || 10;

  // This effect reloads results data on every `query` (full query) or `page` change.
  useEffect(() => {
    async function fetchData() {
      const result = await msearch(url, { query, size, from: (page - 1) * size });
      setData(result.responses[0].hits.hits);
      setTotal(result.responses[0].hits.total);
    }
    fetchData();
  }, [JSON.stringify(query), page]);

  return (
    <div className="react-elasticsearch-results">
      {resultsInfo ? resultsInfo(total) : <>{total} results</>}
      {data.map(r => (
        <div key={r._source.REF}>Résultat n°{r._source.TICO}</div>
      ))}
      {pagination || (
        <Pagination
          onChange={p => setPage(p)}
          total={total}
          itemsPerPage={size}
          currentPage={page}
        />
      )}
    </div>
  );
}
