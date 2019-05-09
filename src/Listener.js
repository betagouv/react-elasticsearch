import React, { useEffect } from "react";
import { useSharedContext } from "./SharedContextProvider";
import { msearch, queryFrom, defer } from "./utils";

// This component needs to be cleaned.
export default function({ children, onChange, ...rest }) {
  const [{ url, listenerEffect, widgets, headers }, dispatch] = useSharedContext();

  // We need to prepare some data in each render.
  // This needs to be done out of the effect function.
  function widgetThat(key) {
    return new Map([...widgets].filter(([, v]) => v[key]));
  }
  function mapFrom(key) {
    return new Map([...widgets].filter(([, v]) => v[key]).map(([k, v]) => [k, v[key]]));
  }

  const resultWidgets = widgetThat("react");
  const queries = mapFrom("query");
  const configurations = mapFrom("configuration");
  const values = mapFrom("value");

  useEffect(() => {
    // Apply custom callback effect on every change, useful for query params.
    if (onChange) {
      // Add pages to params.
      const pages = [...configurations]
        .filter(([, v]) => v.page && v.page > 1)
        .map(([k, v]) => [`${k}Page`, v.page]);
      // Run the change callback with all params.
      onChange(new Map([...pages, ...values]));
    }
    // Run the deferred (thx algolia) listener effect.
    listenerEffect && listenerEffect();
  });
  // Run effect on update for each change in queries or configuration.
  useEffect(() => {
    // If you are debugging and your debug path leads you here, you might
    // check configurableWidgets and searchWidgets actually covers
    // the whole list of components that are configurables and queryable.
    const queriesReady = queries.size === widgets.size;
    console.log("HEYYYYYYY", queries.size, widgets.size);
    console.log("queries", queries);
    console.log("widgets", widgets);
    // const configurationsReady = configurations.size === configurableWidgets.size;
    if (queriesReady) {
      // The actual query to ES is deffered, to wait for all effects
      // and context operations before running.
      defer(() => {
        dispatch({
          type: "setListenerEffect",
          value: () => {
            const msearchData = [];
            console.log("widgets", widgets);
            console.log("resultWidgets", resultWidgets);
            resultWidgets.forEach((widget, id) => {
              const queries = [];
              for (let i = 0; i < widget.react.length; i++) {
                const w = widgets.get(widget.react[i]);
                if (!w) {
                  console.warn(
                    `Cant find component ${widget.react[i]} reacting to component ${id}`
                  );
                  continue;
                }
                queries.push(w.query);
              }
              msearchData.push({ queries, id });
            });

            // Fetch the data.
            async function fetchData() {
              // Only if there is a query to run.
              if (msearchData.length) {
                console.log("QUERY", msearchData);
                const result = await msearch(url, msearchData, headers);
                result.responses.forEach((response, key) => {
                  const widget = widgets.get(msearchData[key].id);
                  widget.response = response;
                  // Update widget
                  dispatch({ type: "setWidget", key: msearchData[key].id, ...widget });
                });
              }
            }
            fetchData();
            // Destroy the effect listener to avoid infinite loop!
            dispatch({ type: "setListenerEffect", value: null });
          }
        });
      });
    }
  }, [JSON.stringify(Array.from(queries)), JSON.stringify(Array.from(configurations))]);

  return <div {...rest}>{children}</div>;
}
