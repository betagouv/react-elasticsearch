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
  const [initialization, setInitialization] = useState(true);
  const [page, setPage] = useState(initialPage);
  const widget = widgets.get(id);

  const data = getHits(widget);
  const total = getTotal(widget);

  //If no react, react to all I tries, I failed
  // console.log("REACT TO ALL", widgets);
  // if (!react) {
  //   react = [...widgets].reduce((acc, v) => {
  //     if (v[0].indexOf("_facet") === -1 && v[0] !== id) {
  //       acc.push(v[0]);
  //     }
  //     return acc;
  //   }, []);
  // }

  useEffect(() => {
    setPage(initialization ? initialPage : 1);
    return () => setInitialization(false);
  }, [total]);

  // Update context with page (and itemsPerPage)
  useEffect(() => {
    dispatch({
      type: "setWidget",
      key: id,
      react,
      query: react ? {} : null,
      value: null,
      configuration: { itemsPerPage, page, sort },
      result: data && total ? { data, total } : null
    });

    console.log("react", react);
  }, [page, sort]);

  const defaultPagination = () => (
    <Pagination onChange={p => setPage(p)} total={total} itemsPerPage={itemsPerPage} page={page} />
  );

  return (
    <div className="react-es-results">
      {stats ? stats(total) : <>{total} results</>}
      {data.map(r => item(r._source, r._score, r._id))}
      {pagination ? pagination(total, itemsPerPage, page, setPage) : defaultPagination()}
    </div>
  );
}
