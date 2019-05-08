import React, { useState, useEffect } from "react";
import { toTermQueries } from "./utils";
import { useSharedContext } from "./SharedContextProvider";

function getTotal(response) {
  return (response && response.hits && response.hits.total) || 0;
}
function getData(response) {
  return (response && response.hits && response.hits.hits) || [];
}
function getAggregations(response, name) {
  return (response && response.aggregations[name] && response.aggregations[name].buckets) || [];
}

export default function({
  fields,
  id,
  initialValue,
  seeMore,
  placeholder,
  showFilter = true,
  filterValueModifier,
  itemsPerBlock
}) {
  const [{ widgets }, dispatch] = useSharedContext();
  // Current filter (search inside facet value).
  const [filterValue, setFilterValue] = useState("");
  // Number of itemns displayed in facet.
  const [size, setSize] = useState(itemsPerBlock || 20);
  // The actual selected items in facet.
  const [value, setValue] = useState(initialValue || []);
  // Data from internal queries (Elasticsearch queries are performed via Listener)
  const { response } = widgets.get(id) || {};

  const aggs = getAggregations(response, "facet");

  /*
GET _search
{
  "size": 0,
  "aggregations": {
    "facet": {
      "terms": {
        "field": "AUTR.keyword",
        "size": 10
      }
    }
  },
  "query": {
    "term": {
      "AUTR.keyword": "ou"
    }
  }
}*/

  function getAggsQuery() {
    const query = {};
    query.size = 0;
    query.aggregations = { facet: { terms: { field: fields[0], size } } };
    query.query = { term: {} };
    query.query.term[fields[0]] = filterValue;
    return query;
  }

  // Update widgets properties on state change.
  useEffect(() => {
    dispatch({
      type: "setWidget",
      key: id,
      react: [id],
      query: getAggsQuery(),
      value
    });
  }, [size, filterValue, value]);

  // If widget value was updated elsewhere (ex: from active filters deletion)
  // We have to update and dispatch the component.
  useEffect(() => {
    widgets.get(id) && setValue(widgets.get(id).value);
  }, [isValueReady()]);

  // Destroy widget from context (remove from the list to unapply its effects)
  useEffect(() => () => dispatch({ type: "deleteWidget", key: id }), []);

  // Checks if widget value is the same as actual value.
  function isValueReady() {
    return !widgets.get(id) || widgets.get(id).value == value;
  }

  return (
    <div className="react-es-facet">
      {showFilter ? (
        <input
          value={filterValue}
          placeholder={placeholder || "filter…"}
          type="text"
          onChange={e => {
            setFilterValue(e.target.value);
          }}
        />
      ) : null}
      {aggs.map(item => (
        <label key={item.key}>
          <input
            type="checkbox"
            checked={value.includes(item.key)}
            onChange={e => {
              // On checkbox status change, add or remove current agg to selected
              const newValue = e.target.checked
                ? [...new Set([...value, item.key])]
                : value.filter(f => f !== item.key);
              setValue(newValue);
            }}
          />
          {item.key} ({item.doc_count})
        </label>
      ))}
      {aggs.length === size ? (
        <button onClick={() => setSize(size + (itemsPerBlock || 5))}>
          {seeMore || "see more"}
        </button>
      ) : null}
    </div>
  );
}
