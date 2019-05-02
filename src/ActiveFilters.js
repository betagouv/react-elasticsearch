import React from "react";
import { useSharedContext } from "./SharedContextProvider";

export default function({ item }) {
  const [{ widgets }, dispatch] = useSharedContext();
  // Get all values from widgets.
  const values = new Map([...widgets].filter(([, v]) => v.value).map(([k, v]) => [k, v.value]));

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

  const items = [...values]
    .filter(([, v]) => (Array.isArray(v) ? v.length : v))
    .map(([k, v]) => {
      return (
        <li key={k}>
          {item ? item(k, v) : `${k} - ${v}`}
          <button onClick={() => removeFilter(k)}>delete</button>
        </li>
      );
    });

  return <div className="react-es-active-filters">{items.length ? <ul>{items}</ul> : <div />}</div>;
}
