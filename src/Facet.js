import React, { useState, useEffect } from "react";
import { toTermQueries } from "./utils";
import { useSharedContext } from "./SharedContextProvider";

export default function({ fields, id, initialValue }) {
  const [{ widgets }, dispatch] = useSharedContext();
  // Current filter (search inside facet value).
  const [filterValue, setFilterValue] = useState("");
  // Number of itemns displayed in facet.
  const [size, setSize] = useState(5);
  // The actual selected items in facet.
  const [selectedInputs, setSelectedInputs] = useState(initialValue || []);
  // Data from internal queries (Elasticsearch queries are performed via Listener)
  const widget = widgets.get(id);
  const data = widget && widget.result && widget.result.data ? widget.result.data : [];
  const total = widget && widget.result && widget.result.total ? widget.result.total : 0;

  // Update Component configuration (in order to change context) on change
  // (see Component properties below).
  useEffect(() => {
    dispatch({
      type: "setWidget",
      key: id,
      needsQuery: true,
      needsConfiguration: true,
      isFacet: true,
      wantResults: false,
      query: { bool: { should: toTermQueries(fields, selectedInputs) } },
      value: selectedInputs,
      configuration: { size, filterValue, fields },
      result: data && total ? { data, total } : null
    });
  }, [size, filterValue, selectedInputs]);

  // Destroy widget (remove from list to unapply conf)
  useEffect(() => {
    return function cleanUp() {
      dispatch({ type: "deleteWidget", key: id });
    };
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
            }}
          />
          {item.key} ({item.doc_count})
        </label>
      ))}
      {data.length === size ? <button onClick={() => setSize(size + 5)}>Voir plus</button> : null}
    </div>
  );
}
