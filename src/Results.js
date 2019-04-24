import React, { useEffect, useState } from "react";
import { useSharedContext } from "./SharedContextProvider";
import Pagination from "./Pagination";

// Pagination, stats function (like "30 results"), item
// and size (number items per page) are customizable.
export default function({ size, pagination, stats, item }) {
  const [{ result }, dispatch] = useSharedContext();
  const [page, setPage] = useState(1);
  size = size || 10;

  useEffect(() => {
    dispatch({ type: "setPage", page });
  }, [page]);

  if (!result) {
    return <></>;
  }

  const { total, data } = result;

  const defaultPagination = () => (
    <Pagination onChange={p => setPage(p)} total={total} itemsPerPage={size} page={page} />
  );

  return (
    <div className="react-es-results">
      {stats ? stats(total) : <>{total} results</>}
      {data.map(r => item(r._source, r._score, r._id))}
      {pagination ? pagination(total, size, page) : defaultPagination()}
    </div>
  );
}
