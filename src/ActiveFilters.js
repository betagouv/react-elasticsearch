import React from "react";
import { useSharedContext } from "./SharedContextProvider";

export default function({ items }) {
  const [{ widgets }, dispatch] = useSharedContext();
  const activeFilters = [...widgets]
    .filter(([, v]) => (Array.isArray(v.value) ? v.value.length : v.value))
    .map(([k, v]) => ({
      key: k,
      value: Array.isArray(v.value) ? v.value.join(", ") : v.value
    }));

  // On filter remove, update widget properties.
  function removeFilter(id) {
    const widget = widgets.get(id);
    dispatch({
      type: "setWidget",
      key: id,
      ...widget,
      value: widget.isFacet ? [] : ""
    });
  }

  return (
    <div className="react-es-active-filters">
      {items ? (
        items(activeFilters, removeFilter)
      ) : (
        <ul>
          {activeFilters.map(({ key, value }) => {
            return (
              <li key={key}>
                <span>{`${key}: ${value}`}</span>
                <button onClick={() => removeFilter(key)}>x</button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
