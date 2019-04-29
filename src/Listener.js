import React, { useEffect } from "react";
import { useSharedContext } from "./SharedContextProvider";
import { msearch, queryFrom, defer } from "./utils";

// This component needs to be cleaned.
export default function({ children, onChange }) {
  const [{ url, listenerEffect, widgets }, dispatch] = useSharedContext();

  function onlyWidget(callback) {
    return new Map([...widgets].filter(callback));
  }

  const queries = new Map([...widgets].filter(([, v]) => v.query).map(([k, v]) => [k, v.query]));
  const configurations = new Map(
    [...widgets].filter(([, v]) => v.configuration).map(([k, v]) => [k, v.configuration])
  );
  const searchComponents = onlyWidget(([, v]) => v.needsQuery);
  const resultComponents = onlyWidget(([, v]) => v.wantResults);
  const values = new Map(
    [...widgets].filter(([, v]) => v.value).map(([k, v]) => [k, v.value])
  );
  const configurableComponents = onlyWidget(([, v]) => v.needsConfiguration);
  const facetComponents = onlyWidget(([, v]) => v.isFacet);

  // Apply callback effect on every change, useful for query params.
  useEffect(() => {
    onChange && onChange(values);
    listenerEffect && listenerEffect();
  });

  // Run effect on update for each change in queries or configuration.
  useEffect(() => {
    const queriesReady = queries.size === searchComponents.size;
    const configurationsReady = configurations.size === configurableComponents.size;
    if (queriesReady && configurationsReady) {
      defer(() => {
        dispatch({
          type: "setListenerEffect",
          value: () => {
            const msearchData = [];
            // If you are debugging and your debug path leads you here, you might
            // check configurableComponents and searchComponents actually covers
            // the whole list of components that are configurables and queryable.
            // On other hand, each configurable must dispacth a setConfiguration
            // type in a useEffect function.
            resultComponents.forEach((r, id) => {
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
            facetComponents.forEach((f, id) => {
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

            async function fetchData() {
              if (msearchData.length) {
                const result = await msearch(url, msearchData);
                result.responses.forEach((response, key) => {
                  const widget = widgets.get(msearchData[key].id);
                  widget.result = {
                    data: msearchData[key].data(response),
                    total: msearchData[key].total(response)
                  };
                  dispatch({ type: "setWidget", key: msearchData[key].id, ...widget });
                });
              }
            }
            fetchData();
            dispatch({ type: "setListenerEffect", value: null });
          }
        });
      });
    }
  }, [JSON.stringify(Array.from(queries)), JSON.stringify(Array.from(configurations))]);

  return <>{children}</>;
}
