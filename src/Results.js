import React, { useEffect, useState } from "react";
import { useSharedContext } from "./SharedContextProvider";
import Pagination from "./Pagination";

// Pagination, informations about results (like "30 results")
// and size (number items per page) are customizable.
export default function({ itemsPerPage, pagination, stats, item, id }) {
  const [{ results }, dispatch] = useSharedContext();
  const [page, setPage] = useState(1);
  const data = results.get(id) ? results.get(id).data : [];
  const total = results.get(id) ? results.get(id).total : 0;
  itemsPerPage = itemsPerPage || 10;

  useEffect(() => {
    setPage(1);
  }, [total]);

  // Update context with page (and itemsPerPage)
  useEffect(() => {
    dispatch({ type: "setConfiguration", key: id, itemsPerPage, page });
  }, [page]);

  const defaultPagination = () => (
    <Pagination onChange={p => setPage(p)} total={total} itemsPerPage={itemsPerPage} page={page} />
  );

  return (
    <div className="react-es-results">
      {stats ? stats(total) : <>{total} results</>}
      {data.map(r => item(r._source, r._score, r._id))}
      {pagination ? pagination(total, itemsPerPage, page) : defaultPagination()}
    </div>
  );
}
