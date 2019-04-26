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
  })

  // Run effect on update for each change in queries or configuration.
  useEffect(() => {
    // Children are flattened, in order to check their "kind" (search, result, etc.)
    function flatChildren(arr, initial) {
      return arr.reduce((accumulator, current) => {
        if (!React.isValidElement(current)) {
          return current;
        }
        if (current.props.children) {
          return flatChildren(React.Children.toArray(current.props.children), [
            ...accumulator,
            current
          ]);
        }
        return [...accumulator, current];
      }, initial || []);
    }
    const flat = flatChildren(React.Children.toArray(children));
    const searchComponents = flat.filter(e => e.type === SearchBox || e.type === Facet);
    const resultComponents = flat.filter(e => e.type === Results);
    const facetComponents = flat.filter(e => e.type === Facet);

    // The main condition. Do not modifiy! It ensures search queries are 
    // performed after children have initialized their contextual properties.
    if (queries.size === searchComponents.length) {
      // Fetch data for results components.
      resultComponents.forEach(r => {
        async function fetchData() {
          const result = await msearch(url, {
            query: queryFrom(queries),
            size: configurations.get(r.props.id).itemsPerPage,
            from: (configurations.get(r.props.id).page - 1) * configurations.get(r.props.id).itemsPerPage
          });
          dispatch({
            type: "setResult",
            key: r.props.id,
            data: result.responses[0].hits.hits,
            total: result.responses[0].hits.total
          });
        }
        fetchData();
      });
      
      // Fetch data for internal facet components.
      facetComponents.forEach(f => {
        const { id, fields } = f.props;
        const size = configurations.get(id).size;
        const filterValue = configurations.get(id).filterValue;
        async function fetchData() {
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
          // Use previous function to perform query to elasticsearch endpoint
          const result = await msearch(url, aggsFromFields());
          // setData(result.responses[0].aggregations[fields[0]].buckets);
          dispatch({
            type: "setResult",
            key: id,
            data: result.responses[0].aggregations[fields[0]].buckets,
            total: result.responses[0].hits.total
          });
        }
        fetchData();
      });
      
    }
  }, [JSON.stringify(Array.from(queries)), JSON.stringify(Array.from(configurations)) ]);

  return <>{children}</>;
}
