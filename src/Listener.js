import React, { useEffect } from "react";
import { useSharedContext } from "./SharedContextProvider";
import { msearch, queryFrom } from "./utils";
import SearchBox from "./SearchBox";
import Facet from "./Facet";
import Results from "./Results";

export default function({ children, onChange }) {
  const [{ queries, url }, dispatch] = useSharedContext();

  useEffect(() => {
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
    if (queries.size === searchComponents.length) {
      resultComponents.forEach(r => {
        async function fetchData() {
          const result = await msearch(url, {
            query: queryFrom(queries),
            size: 10, // FIX
            from: 0 /* (page - 1) * size */ // FIX
          });
          console.log(r.props.id, result.responses[0].hits.total);
          dispatch({
            type: "results",
            key: r.props.id,
            data: result.responses[0].hits.hits,
            total: result.responses[0].hits.total
          });
        }
        fetchData();
      });
      
      facetComponents.forEach(f => {
        const { id, fields } = f.props;
        const size = 5; // FIX
        const filterValue = ""; // FIX
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
            type: "results",
            key: id,
            data: result.responses[0].aggregations[fields[0]].buckets,
            total: result.responses[0].hits.total
          });
        }
        fetchData();
      });
      
    }
  }, [JSON.stringify(Array.from(queries))]);

  useEffect(() => {
    onChange && onChange(/* params */);
  });

  return <>{children}</>;
}
