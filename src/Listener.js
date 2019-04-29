import React, { useEffect } from "react";
import { useSharedContext } from "./SharedContextProvider";
import { msearch, queryFrom, defer } from "./utils";

// This component needs to be cleaned.
export default function({ children, onChange }) {
  const [{ url, listenerEffect, widgets }, dispatch] = useSharedContext();

  // We need to prepare some data in each render.
  // This needs to be done out of the effect function.
  function widgetThat(key) {
    return new Map([...widgets].filter(([, v]) => v[key]));
  }
  function mapFrom(key) {
    return new Map([...widgets].filter(([, v]) => v[key]).map(([k, v]) => [k, v[key]]));
  }
  const configurableWidgets = widgetThat("needsConfiguration");
  const facetWidgets = widgetThat("isFacet");
  const searchWidgets = widgetThat("needsQuery");
  const resultWidgets = widgetThat("wantResults");
  const queries = mapFrom("query");
  const configurations = mapFrom("configuration");
  const values = mapFrom("value");

  useEffect(() => {
    // Apply custom callback effect on every change, useful for query params.
    onChange && onChange(values);
    // Run the deferred (thx algolia) listener effect.
    listenerEffect && listenerEffect();
  });

  // Run effect on update for each change in queries or configuration.
  useEffect(() => {
    // If you are debugging and your debug path leads you here, you might
    // check configurableWidgets and searchWidgets actually covers
    // the whole list of components that are configurables and queryable.
    const queriesReady = queries.size === searchWidgets.size;
    const configurationsReady = configurations.size === configurableWidgets.size;
    if (queriesReady && configurationsReady) {
      // The actual query to ES is deffered, to wait for all effects 
      // and context operations before running.
      defer(() => {
        dispatch({
          type: "setListenerEffect",
          value: () => {
            const msearchData = [];
            resultWidgets.forEach((r, id) => {
              const { itemsPerPage, page } = r.configuration;
              msearchData.push({
                query: {
                  query: queryFrom(queries),
                  size: itemsPerPage,
                  from: (page - 1) * itemsPerPage
                },
                data: result => result.hits.hits,
                total: result => result.hits.total,
                id
              });
            });

            // Fetch data for internal facet components.
            facetWidgets.forEach((f, id) => {
              const fields = f.configuration.fields;
              const size = f.configuration.size;
              const filterValue = f.configuration.filterValue;

              // Get the aggs (elasticsearch queries) from fields
              // Dirtiest part, because we build a raw query from various params
              function aggsFromFields() {
                // Remove current query from queries list (do not react to self)
                function withoutOwnQueries() {
                  const q = new Map(queries);
                  q.delete(id);
                  return q;
                }
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
                return { query: queryFrom(withoutOwnQueries()), size: 0, aggs: result };
              }
              msearchData.push({
                query: aggsFromFields(),
                data: result => result.aggregations[fields[0]].buckets,
                total: result => result.hits.total,
                id: id
              });
            });

            // Fetch the data.
            async function fetchData() {
              // Only if there is a query to run.
              if (msearchData.length) {
                const result = await msearch(url, msearchData);
                result.responses.forEach((response, key) => {
                  const widget = widgets.get(msearchData[key].id);
                  widget.result = {
                    data: msearchData[key].data(response),
                    total: msearchData[key].total(response)
                  };
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

  return <>{children}</>;
}
