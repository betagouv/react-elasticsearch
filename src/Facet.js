import React, { useState, useEffect } from "react";
import { msearch, toTermQueries, queryFrom, toString } from "./utils";
import { useSharedContext } from "./SharedContextProvider";

export default function({ fields, id }) {
  const [{ reactives, url }, dispatch] = useSharedContext();
  const [data, setData] = useState([]);
  const [filterValue, setFilterValue] = useState("");
  const [size, setSize] = useState(5);
  const current = reactives.get(id);
  const defaultValue = current ? current.value : [];
  const [selectedInputs, setSelectedInputs] = useState(defaultValue);

  // Init values with default
  useEffect(() => {
    if (defaultValue && defaultValue.length) {
      // Update external queries.
      dispatch({
        type: "update",
        key: id,
        value: selectedInputs,
        query: v => ({ bool: { should: toTermQueries(fields, v) } })
      });
    }
  }, [defaultValue]);

  // This effect reloads data on `filterValue`, `size` or `queries` change.
  useEffect(() => {
    // Remove current query from queries list (do not react to self)
    function withoutOwnQueries() {
      return new Map(Array.from(reactives).filter(([k, _v]) => k !== id));
    }
    // Get all data (aggs) for the facet list
    async function fetchData() {
      // Get the aggs (elasticsearch queries) from fields
      // Dirtiest part, because we build a raw query from various params
      function aggsFromFields() {
        // Transform a single field to agg query
        function aggFromField(field) {
          const t = { field, order: { _count: "desc" }, size };
          if (filterValue) {
            t.include = `.*${filterValue}.*`;
          }
          return { [field]: { terms: t } };
        }
        // Actually build the query from fields
        let result = {};
        fields.forEach(f => {
          result = { ...result, ...aggFromField(f) };
        });
        return {
          query: queryFrom(Array.from(withoutOwnQueries(), ([k, v]) => v.query(v.value))),
          size: 0,
          aggs: result
        };
      }
      for (let q of withoutOwnQueries().values()) {
        if (!q.query) {
          return;
        }
      }
      // Use previous function to perform query to elasticsearch endpoint
      const result = await msearch(url, aggsFromFields());
      setData(result.responses[0].aggregations[fields[0]].buckets);
    }
    fetchData();
  }, [filterValue, size, toString(reactives)]);

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
                type: "update",
                key: id,
                value: newSelectedInputs,
                query: v => ({ bool: { should: toTermQueries(fields, v) } })
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
