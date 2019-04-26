import React, { useState, useEffect } from "react";
import { toTermQueries } from "./utils";
import { useSharedContext } from "./SharedContextProvider";

export default function({ fields, id, initialValue }) {
  const [{ results }, dispatch] = useSharedContext();
  // Current filter (search inside facet value).
  const [filterValue, setFilterValue] = useState("");
  // Number of itemns displayed in facet.
  const [size, setSize] = useState(5);
  // The actual selected items in facet.
  const [selectedInputs, setSelectedInputs] = useState(initialValue || []);
  // Data from internal queries (Elasticsearch queries are performed via Listener)
  const data = results.get(id) ? results.get(id).data : [];

  // Update Component configuration (in order to change context) on change 
  // (see Component properties below).
  useEffect(() => {
    dispatch({ type: "setConfiguration", key: id, size, filterValue });
  }, [size, filterValue]);

  // Update external query on mount.
  useEffect(() => {
    dispatch({
      type: "setQuery",
      key: id,
      query: { bool: { should: toTermQueries(fields, selectedInputs) } },
      value: selectedInputs
    });
  }, []);

  return (
    <div className="react-es-facet">
      <input
        value={filterValue}
        placeholder="Filter facet"
        onChange={e => {
          setFilterValue(e.target.value);
        }}
      />
      {data.map(item => (
        <label key={item.key}>
          <br />
          <input
            type="checkbox"
            checked={selectedInputs.includes(item.key)}
            onChange={e => {
              // On checkbox status change, add or remove current agg to selected
              const newSelectedInputs = e.target.checked
                ? [...new Set([...selectedInputs, item.key])]
                : selectedInputs.filter(f => f !== item.key);
              setSelectedInputs(newSelectedInputs);
              // Update external queries.
              dispatch({
                type: "setQuery",
                key: id,
                query: {
                  bool: { should: toTermQueries(fields, newSelectedInputs) }
                },
                value: newSelectedInputs
              });
            }}
          />
          {item.key} ({item.doc_count})
        </label>
      ))}
      {data.length === size ? <button onClick={() => setSize(size + 5)}>Voir plus</button> : null}
    </div>
  );
}
