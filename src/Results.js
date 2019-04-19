import React, { useEffect, useState } from "react";
import { msearch, queryFrom } from "./utils";
import { getStateContext } from "./StateContextProvider";
import Pagination from "./Pagination";

export default function({ size }) {
  const [{ queries }] = getStateContext();
  const [data, setData] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const query = queryFrom(queries);

  size = size || 10;

  useEffect(() => {
    async function fetchData() {
      const result = await msearch({ query, size, from: (page - 1) * size });
      setData(result.responses[0].hits.hits);
      setTotal(result.responses[0].hits.total);
    }
    fetchData();
  }, [JSON.stringify(query), page]);

  return (
    <div style={{ border: "green 2px solid", margin: "10px" }}>
      <h5>Résultats : {total}</h5>
      {data.map(r => (
        <div key={r._source.REF}>Résultat n°{r._source.TICO}</div>
      ))}
      <Pagination
        onChange={p => setPage(p)}
        total={total}
        itemsPerPage={size}
        currentPage={page}
      />
    </div>
  );
}
