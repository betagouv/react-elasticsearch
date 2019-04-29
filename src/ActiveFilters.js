import React from "react";
import { useSharedContext } from "./SharedContextProvider";

// Pagination, informations about results (like "30 results")
// and size (number items per page) are customizable.
export default function({ item }) {
  const [{ values }] = useSharedContext();

  const items = [...values]
    .filter(([_k, v]) => (Array.isArray(v) ? v.length : v))
    .map(([k, v]) => {
      return <li key={k}>{item ? item(k, v) : `${k} - ${v}`}</li>;
    });

  return <div className="react-es-active-filters">{items.length ? <ul>{items}</ul> : <div></div>}</div>;
}