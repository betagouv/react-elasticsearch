import React, { useEffect, useState } from "react";
import { useSharedContext } from "./SharedContextProvider";
import { msearch, defer, isEqual } from "./utils";

// This component needs to be cleaned.
export default function({ children, onChange, ...rest }) {
  const [{ url, listenerEffect, widgets, headers }, dispatch] = useSharedContext();
  const [previousQueryMap, setPreviousQueryMap] = useState(new Map());

  function mapFrom(key) {
    return new Map([...widgets].filter(([, v]) => v[key]).map(([k, v]) => [k, v[key]]));
  }

  const queries = mapFrom("query");
  const values = mapFrom("value");

  useEffect(() => {
    // Apply custom callback effect on every change, useful for query params.
    if (onChange) {
      onChange(values);
    }
    // Run the deferred (thx algolia) listener effect.
    listenerEffect && listenerEffect();
  });

  // Run effect on update for each change in queries or configuration.
  useEffect(() => {
    // If you are debugging and your debug path leads you here, you might
    // check configurableWidgets and searchWidgets actually covers
    // the whole list of components that are configurables and queryable.
    // The actual query to ES is deffered, to wait for all effects
    // and context operations before running.
    defer(() => {
      dispatch({
        type: "setListenerEffect",
        value: () => {
          const queryMap = new Map();
          widgets.forEach((widget, id) => {
            //only widget which reacts to something need to have queries
            if (!widget.react) {
              return;
            }
            const arr = [];
            for (let i = 0; i < widget.react.length; i++) {
              const w = widgets.get(widget.react[i]);
              if (!w) {
                console.warn(`Cant find component ${widget.react[i]} reacting to component ${id}`);
                continue;
              }
              arr.push(w.query);
            }
            queryMap.set(id, arr);
          });

          function queriesToExec() {
            const arr = [];
            queryMap.forEach((queries, id) => {
              const prev = previousQueryMap.get(id);
              if (!prev || !isEqual(prev, queries)) {
                arr.push({ queries, id });
              }
            });
            return arr;
          }
          // Fetch the data.
          async function fetchData() {
            const msearchData = queriesToExec();
            // Only if there is a query to run.
            if (msearchData.length) {
              const result = await msearch(url, msearchData, headers);
              result.responses.forEach((response, key) => {
                const widget = widgets.get(msearchData[key].id);
                if (response.status !== 200) {
                  console.error(response.error.reason);
                  return;
                }
                widget.response = response;
                console.log("dispatch", msearchData[key].id);
                dispatch({ type: "setWidget", key: msearchData[key].id, ...widget }); // Update widget
              });
            }
          }
          fetchData();
          setPreviousQueryMap(queryMap);
          // Destroy the effect listener to avoid infinite loop!
          dispatch({ type: "setListenerEffect", value: null });
        }
      });
    });
  }, [JSON.stringify(Array.from(queries))]);

  return <div {...rest}>{children}</div>;
}
