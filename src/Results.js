import React, { useEffect, useState } from "react";
import { useSharedContext } from "./SharedContextProvider";
import { getHits, getTotal } from "./utils";
import Pagination from "./Pagination";

// Pagination, informations about results (like "30 results")
// and size (number items per page) are customizable.
export default function({
  itemsPerPage = 10,
  initialPage = 1,
  pagination,
  stats,
  item,
  id,
  sort,
  react
}) {
  const [{ widgets }, dispatch] = useSharedContext();
  // const [initialization, setInitialization] = useState(true);
  const [page, setPage] = useState(initialPage);
  const widget = widgets.get(id);

  const data = getHits(widget);
  const total = getTotal(widget);
  const widgetCount = widgets.size;

  // function getDefautReactWidgets() {
  //   if (react) {
  //     return react;
  //   }
  //   return [...widgets].reduce((acc, v) => {
  //     if (v[0] !== id) {
  //       acc.push(v[0]);
  //     }
  //     return acc;
  //   }, []);
  // }

  useEffect(() => {
    dispatch({
      type: "setWidget",
      key: id,
      needsResults: true,
      query: {},
      value: null
    });
  }, []);

  const defaultPagination = () => (
    <Pagination
      id="pagination"
      onChange={p => setPage(p)}
      total={total}
      itemsPerPage={itemsPerPage}
      page={page}
    />
  );

  return (
    <div className="react-es-results">
      {stats ? stats(total) : <>{total} results</>}
      {data.map(r => item(r._source, r._score, r._id))}
      {pagination ? pagination(total, itemsPerPage, page, setPage) : defaultPagination()}
    </div>
  );
}
