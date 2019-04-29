import React, { useEffect, useState } from "react";
import { useSharedContext } from "./SharedContextProvider";
import Pagination from "./Pagination";

// Pagination, informations about results (like "30 results")
// and size (number items per page) are customizable.
export default function({ itemsPerPage, pagination, stats, item, id }) {
  const [{ widgets }, dispatch] = useSharedContext();
  const [page, setPage] = useState(1);
  const widget = widgets.get(id);
  const data = widget && widget.result && widget.result.data ? widget.result.data : [];
  const total = widget && widget.result && widget.result.total ? widget.result.total : 0;
  itemsPerPage = itemsPerPage || 10;

  useEffect(() => {
    setPage(1);
  }, [total]);

  // Update context with page (and itemsPerPage)
  useEffect(() => {
    dispatch({
      type: "setWidget",
      key: id,
      needsQuery: false,
      needsConfiguration: true,
      isFacet: false,
      wantResults: true,
      query: null,
      value: null,
      configuration: { itemsPerPage, page },
      result: data && total ? { data, total } : null
    });
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
