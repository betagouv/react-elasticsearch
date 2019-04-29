import React, { useEffect } from "react";
import { useSharedContext } from "./SharedContextProvider";
import { msearch, queryFrom, defer } from "./utils";

// This component needs to be cleaned.
export default function({ children, onChange }) {
  const [
    {
      queries,
      url,
      configurations,
      values,
      resultComponents,
      searchComponents,
      configurableComponents,
      facetComponents,
      bigThing
    },
    dispatch
  ] = useSharedContext();

  // Apply callback effect on every change, useful for query params.
  useEffect(() => {
    onChange && onChange(values);
    bigThing && bigThing();
  });

  // Run effect on update for each change in queries or configuration.
  useEffect(() => {
    console.log({ queries, configurations, searchComponents, configurableComponents });
    const queriesReady = queries.size === searchComponents.size;
    const configurationsReady = configurations.size === configurableComponents.size;
    if (queriesReady && configurationsReady) {
      defer(() => {
        dispatch({
          type: "setBigThing",
          value: () => {
            const msearchData = [];
            // If you are debugging and your debug path leads you here, you might
            // check configurableComponents and searchComponents actually covers
            // the whole list of components that are configurables and queryable.
            // On other hand, each configurable must dispacth a setConfiguration
            // type in a useEffect function.
            resultComponents.forEach(r => {
              const { itemsPerPage, page } = configurations.get(r);
              msearchData.push({
                query: {
                  query: queryFrom(queries),
                  size: itemsPerPage,
                  from: (page - 1) * itemsPerPage
                },
                data: result => result.hits.hits,
                total: result => result.hits.total,
                id: r
              });
            });

            // Fetch data for internal facet components.
            facetComponents.forEach(f => {
              // const { id, fields } = f.props;
              const id = f;
              const fields = ["AUTR.keyword"];
              const size = configurations.get(id).size;
              const filterValue = configurations.get(id).filterValue;

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
              const result = await msearch(url, msearchData);
              result.responses.forEach((response, key) => {
                dispatch({
                  type: "setResult",
                  key: msearchData[key].id,
                  data: msearchData[key].data(response),
                  total: msearchData[key].total(response)
                });
              });
            }
            fetchData();
            dispatch({ type: "setBigThing", value: null });
          }
        });
      });
    }
  }, [JSON.stringify(Array.from(queries)), JSON.stringify(Array.from(configurations))]);

  return <>{children}</>;
}
