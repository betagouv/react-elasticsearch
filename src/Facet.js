import React, { useState, useEffect } from "react";
import { toTermQueries, getAggregations } from "./utils";
import { useSharedContext } from "./SharedContextProvider";

export default function({
  fields,
  id,
  initialValue,
  seeMore,
  placeholder,
  showFilter = true,
  filterValueModifier,
  itemsPerBlock,
  react = []
}) {
  const [{ widgets }, dispatch] = useSharedContext();
  // Current filter (search inside facet value).
  const [filterValue, setFilterValue] = useState("");
  // Number of itemns displayed in facet.
  const [size, setSize] = useState(itemsPerBlock || 20);
  // The actual selected items in facet.
  const [value, setValue] = useState(initialValue || []);
  // Data from internal queries (Elasticsearch queries are performed via Listener)

  const aggs = getAggregations(widgets.get(`${id}_facet`), "facet");

  function getAggsQuery() {
    const query = {};
    query.size = 0;
    query.aggregations = {
      facet: { terms: { field: fields[0], size, order: { _count: "desc" } } }
    };
    if (filterValue) {
      query.aggregations.facet.terms.include = !filterValueModifier
        ? `.*${filterValue}.*`
        : filterValueModifier(filterValue);
    }
    query.query = { match_all: {} };
    return query;
  }

  function getQuery() {
    console.log("value", value);
    if (!value || !value.length) {
      return { query: { match_all: {} } };
    }

    const arr = value.map(v => {
      const term = {};
      term[fields[0]] = v;
      return { term };
    });

    return { query: { bool: { should: arr } } };
  }

  // Update facets
  useEffect(() => {
    dispatch({
      type: "setWidget",
      key: `${id}_facet`,
      react: [`${id}_facet`, ...react],
      query: getAggsQuery(),
      value: ""
    });
  }, [size, filterValue]);

  // Update Query
  useEffect(() => {
    dispatch({
      type: "setWidget",
      key: `${id}`,
      // react: [id],
      query: getQuery(),
      value
    });
  }, [value]);

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
