import React, { useState, useEffect } from "react";
import { msearch, toTermQueries, queryFrom } from "./utils";
import { getStateContext } from "./StateContextProvider";

export default function({ fields, id }) {
  const [{ queries }, dispatch] = getStateContext();
  const [data, setData] = useState([]);
  const [filterValue, setFilterValue] = useState("");
  const [size, setSize] = useState(5);
  const [selectedInputs, setSelectedInputs] = useState([]);
  useEffect(() => {
    async function fetchData() {
      function aggsFromFields() {
        function withoutOwnQueries() {
          const q = new Map(queries);
          q.delete(id);
          return q;
        }
        function aggFromField(field) {
          const t = { field, order: { _count: "desc" }, size };
          if (filterValue) {
            t.include = `.*${filterValue}.*`;
          }
          return { [field]: { terms: t } };
        }
        let result = {};
        fields.forEach(f => {
          result = { ...result, ...aggFromField(f) };
        });
        return {
          query: queryFrom(withoutOwnQueries()),
          size: 0,
          aggs: result
        };
      }
      const result = await msearch(aggsFromFields());
      setData(result.responses[0].aggregations[fields[0]].buckets);
    }
    fetchData();
  }, [filterValue, size, JSON.stringify(queryFrom(queries))]);

  return (
    <div style={{ border: "orange 2px solid", margin: "10px" }}>
      <h5>Facette</h5>
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
              const newSelectedInputs = e.target.checked
                ? [...new Set([...selectedInputs, item.key])]
                : selectedInputs.filter(f => f.key === item.key);
              setSelectedInputs(newSelectedInputs);
              dispatch({
                type: "updateQueries",
                key: id,
                value: {
                  bool: { should: toTermQueries(fields, newSelectedInputs) }
                }
              });
            }}
          />
          {item.key} ({item.doc_count})
        </label>
      ))}
      {data.length === size ? (
        <button onClick={() => setSize(size + 5)}>Voir plus</button>
      ) : null}
      <div>Internal query: {JSON.stringify(queries.get(id))}</div>
    </div>
  );
}
