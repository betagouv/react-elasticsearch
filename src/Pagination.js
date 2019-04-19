import React from "react";

export default function({onChange, total, itemsPerPage, currentPage}) {
  let arr = [];
  const max = Math.min(Math.floor(total / itemsPerPage), (10000 / itemsPerPage));

  if (currentPage < 5) {
    arr = [1, 2, 3, 4, 5, max]
  } else if (currentPage >= 5 && currentPage <= max - 4) {
    arr = [1, currentPage - 2, currentPage - 1, currentPage, currentPage + 1, currentPage + 2 ,max]
  } else {
    arr = [1, max -4, max -3, max - 2,  max - 1  ,max]
  }
  arr.filter(e => e <= max)
  return <ul className="react-elasticsearch-pagination">
    {arr.map(i => {
      return <li key={i}><button onClick={() => onChange(i)}>{i}</button></li>
    })}
  </ul>
}
