import React, { useState, useEffect } from "react";
import { toTermQueries } from "./utils";
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
  items
}) {
  const [{ widgets }, dispatch] = useSharedContext();
  // Current filter (search inside facet value).
  const [filterValue, setFilterValue] = useState("");
  // Number of itemns displayed in facet.
  const [size, setSize] = useState(itemsPerBlock || 5);
  // The actual selected items in facet.
  const [value, setValue] = useState(initialValue || []);
  // Data from internal queries (Elasticsearch queries are performed via Listener)
  const { result } = widgets.get(id) || {};
  const data = (result && result.data) || [];
  const total = (result && result.total) || 0;

  // Update widgets properties on state change.
  useEffect(() => {
    dispatch({
      type: "setWidget",
      key: id,
      needsQuery: true,
      needsConfiguration: true,
      isFacet: true,
      wantResults: false,
      query: { bool: { should: toTermQueries(fields, value) } },
      value,
      configuration: { size, filterValue, fields, filterValueModifier },
      result: data && total ? { data, total } : null
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

  // On checkbox status change, add or remove current agg to selected
  function handleChange(item, checked) {
    const newValue = checked
      ? [...new Set([...value, item.key])]
      : value.filter(f => f !== item.key);
    setValue(newValue);
  }

  // Is current item checked?
  function isChecked(item) {
    return value.includes(item.key);
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
      {items
        ? items(data, { handleChange, isChecked })
        : data.map(item => (
            <label key={item.key}>
              <input
                type="checkbox"
                checked={isChecked(item)}
                onChange={e => handleChange(item, e.target.checked)}
              />
              {item.key} ({item.doc_count})
            </label>
          ))}
      {data.length === size ? (
        <button onClick={() => setSize(size + (itemsPerBlock || 5))}>
          {seeMore || "see more"}
        </button>
      ) : null}
    </div>
  );
}
