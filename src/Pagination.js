import React from "react";

export default function({ onChange, total, itemsPerPage, currentPage }) {
  let arr = [];
  const max = Math.min(Math.floor(total / itemsPerPage), 10000 / itemsPerPage);

  // Stupid, ugly and buggy algo. It needs to be improved. Todo: fixit!
  //
  // The main objective is to have this display:
  //
  // (1) (2) (3) (4) (5) ... (1000)             on page 1
  // (1) ... (7) (8) (9) (10) (11) ... (1000)   on page 9
  // (1) ... (996) (997) (998) (999) (1000)     on page 1000
  if (currentPage < 5) {
    arr = [1, 2, 3, 4, 5, max];
  } else if (currentPage >= 5 && currentPage <= max - 4) {
    arr = [1, currentPage - 2, currentPage - 1, currentPage, currentPage + 1, currentPage + 2, max];
  } else {
    arr = [1, max - 4, max - 3, max - 2, max - 1, max];
  }
  arr.filter(e => e <= max);
  return (
    <ul className="react-elasticsearch-pagination">
      {arr.map(i => {
        return (
          <li key={i}>
            <button onClick={() => onChange(i)}>{i}</button>
          </li>
        );
      })}
    </ul>
  );
}
