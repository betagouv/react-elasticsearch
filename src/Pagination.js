import React, { useEffect } from "react";
import { useSharedContext } from "./SharedContextProvider";

// The main objective is to have this display:
//
// (1) (2) (3) (4) (5) ... (1000)             on page 1
// (1) ... (7) (8) (9) (10) (11) ... (1000)   on page 9
// (1) ... (996) (997) (998) (999) (1000)     on page 1000
//
// X and Y are used to simulate "..." with different keys. Just like my code in 1997.
function buttons(page, max) {
  if (page < 5) {
    return [...[...Array(Math.min(max, 5)).keys()].map(e => e + 1), ...(max > 6 ? ["x", max] : [])];
  } else if (page >= 5 && page <= max - 4) {
    return [1, "x", page - 2, page - 1, page, page + 1, page + 2, "y", max];
  }
  return [1, "x", max - 4, max - 3, max - 2, max - 1, max];
}

export default function({ onChange, total, itemsPerPage, page, id }) {
  const [{}, dispatch] = useSharedContext();
  const max = Math.min(Math.ceil(total / itemsPerPage), 10000 / itemsPerPage);

  function createQuery() {
    const query = {
      from: page,
      size: itemsPerPage,
      query: {
        match_all: {}
      }
    };
    return query;
  }

  useEffect(() => {
    dispatch({
      type: "setWidget",
      key: id,
      react: null,
      query: createQuery(),
      value: null
    });
  }, [page, itemsPerPage, total]);

  return (
    <ul className="react-es-pagination">
      {buttons(page, max)
        .filter(e => (Number.isInteger(e) ? e <= max : e))
        .map(i => {
          if (Number.isInteger(i)) {
            return (
              <li key={i} className={page === i ? "react-es-pagination-active-page" : ""}>
                <button onClick={() => onChange(i)}>{i}</button>
              </li>
            );
          }
          return <li key={i}>…</li>;
        })}
    </ul>
  );
}
