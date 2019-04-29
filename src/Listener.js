import React, { useEffect } from "react";
import { useSharedContext } from "./SharedContextProvider";
import { msearch, queryFrom } from "./utils";
import SearchBox from "./SearchBox";
import Facet from "./Facet";
import Results from "./Results";

// This component needs to be cleaned.
export default function({ children, onChange }) {
  const [{ queries, url, configurations, values }, dispatch] = useSharedContext();

  // Apply callback effect on every change, useful for query params.
  useEffect(() => {
    onChange && onChange(values);
  });

  // Run effect on update for each change in queries or configuration.
  useEffect(() => {
    // Children are flattened, in order to check their "kind" (search, result, etc.)
    function flatChildren(arr, initial) {
      return arr.reduce((accumulator, current) => {
        if (React.isValidElement(current) && current.props.children) {
          return flatChildren(React.Children.toArray(current.props.children), [
            ...accumulator,
            current
          ]);
        }
        return [...accumulator, current];
      }, initial || []);
    }
    console.log(React.Children.toArray(children));
    const flat = flatChildren(React.Children.toArray(children));
    console.log(flat);
    const searchComponents = flat.filter(e => e.type === SearchBox || e.type === Facet);
    const resultComponents = flat.filter(e => e.type === Results);
    const facetComponents = flat.filter(e => e.type === Facet);
    const configurableComponents = flat.filter(e => e.type === Facet || e.type === Results);

    // The main condition. Do not modifiy! It ensures search queries are
    // performed after children have initialized their contextual properties.
    const queriesReady = queries.size === searchComponents.length;
    const configurationsReady = configurations.size === configurableComponents.length;
    console.log({
      "queries.size": queries.size,
      searchComponents: searchComponents,
      "configurations.size": configurations.size,
      configurableComponents: configurableComponents
    });
    if (queriesReady && configurationsReady) {
      const msearchData = [];
      // If you are debugging and your debug path leads you here, you might
      // check configurableComponents and searchComponents actually covers
      // the whole list of components that are configurables and queryable.
      // On other hand, each configurable must dispacth a setConfiguration
      // type in a useEffect function.
      resultComponents.forEach(r => {
        const { itemsPerPage, page } = configurations.get(r.props.id);
        msearchData.push({
          query: {
            query: queryFrom(queries),
            size: itemsPerPage,
            from: (page - 1) * itemsPerPage
          },
          data: result => result.hits.hits,
          total: result => result.hits.total,
          id: r.props.id
        });
      });

      // Fetch data for internal facet components.
      facetComponents.forEach(f => {
        const { id, fields } = f.props;
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
          id: f.props.id
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
    }
  }, [JSON.stringify(Array.from(queries)), JSON.stringify(Array.from(configurations))]);

  return <>{children}</>;
}
