import React, { useEffect } from "react";
import { useSharedContext } from "./SharedContextProvider";
import { msearch, queryFrom, defer } from "./utils";

// This component needs to be cleaned.
export default function({ children, onChange }) {
  const [{ url, listenerEffect, widgets, headers }, dispatch] = useSharedContext();

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
              const { itemsPerPage, page, sort } = r.configuration;
              msearchData.push({
                query: {
                  query: queryFrom(queries),
                  size: itemsPerPage,
                  from: (page - 1) * itemsPerPage,
                  sort
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
              const filterValueModifier = f.configuration.filterValueModifier;

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
                    t.include = !filterValueModifier
                      ? `.*${filterValue}.*`
                      : filterValueModifier(filterValue);
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
                data: result => {
                  // Merge aggs (if there is more than one for a facet),
                  // then remove duplicate and add doc_count (sum),
                  // then sort and slice to get only 10 first.
                  const map = new Map();
                  fields
                    .map(f => result.aggregations[f].buckets)
                    .reduce((a, b) => a.concat(b))
                    .forEach(i => {
                      map.set(i.key, {
                        key: i.key,
                        doc_count: map.has(i.key)
                          ? i.doc_count + map.get(i.key).doc_count
                          : i.doc_count
                      });
                    });
                  return [...map.values()].sort((x, y) => y.doc_count - x.doc_count).slice(0, size);
                },
                total: result => result.hits.total,
                id: id
              });
            });

            // Fetch the data.
            async function fetchData() {
              // Only if there is a query to run.
              if (msearchData.length) {
                const result = await msearch(url, msearchData, headers);
                result.responses.forEach((response, key) => {
                  const widget = widgets.get(msearchData[key].id);
                  if (response.status !== 200) {
                    console.error(response.error.reason);
                    return;
                  }
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
