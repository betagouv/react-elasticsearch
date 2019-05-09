import fetch from "unfetch";
import qs from "qs";

// Search with msearch to elasticsearch instance
// Todo reject.
export function msearch(url, msearchData, headers = {}) {
  return new Promise(async (resolve, reject) => {
    headers = {
      ...{ Accept: "application/json", "Content-Type": "application/x-ndjson" },
      ...headers
    };
    const body = msearchData.reduce((acc, val) => {
      console.log(val.id, val.queries);

      const [p, q] = [{ preference: val.id }, queryFrom(val.queries)].map(JSON.stringify);
      return `${acc}${p}\n${q}\n`;
    }, "");
    console.log(body);
    const rawResponse = await fetch(`${url}/_msearch`, { method: "POST", headers, body });
    const response = await rawResponse.json();
    resolve(response);
  });
}

// Build a query from a Map of queries
export function queryFrom(queries) {
  const q = queries.filter(e => !e.query.match_all);
  if (q.length === 0) {
    return { query: { match_all: {} } };
  } else if (q.length === 1) {
    return q[0];
  } else {
    return mergeQueries(q);
    //#https://github.com/appbaseio/reactivecore/blob/master/src/utils/helper.js
    return { query: { match_all: {} } };
  }
  // return { bool: { must: queries.size === 0 ? { match_all: {} } : Array.from(queries.values()) } };
}

function mergeQueries(queries) {
  let query = { query: { bool: { must: [] } } };
  for (let i = 0; i < queries.length; i++) {
    const q = { ...queries[i] };

    if (q.query.bool) {
      if (q.query.bool.must) {
        query.query.bool.must.push(...q.query.bool.must);
      } else {
        console.log("SHOULD Not handle yet");
      }
    } else {
      query.query.bool.must.push(q.query);
    }

    // we add other queries stuff ( function score, size, aggregations )
    delete q.query;
    query = { ...query, ...q };
  }

  console.log("END", query);
  return query;
}

// Convert fields to term queries
export function toTermQueries(fields, selectedValues) {
  const queries = [];
  for (let i in fields) {
    for (let j in selectedValues) {
      queries.push({ term: { [fields[i]]: selectedValues[j] } });
    }
  }
  return queries;
}

// Todo: clean this ugly funtion
export function fromUrlQueryString(str) {
  return new Map([
    ...Object.entries(qs.parse(str.replace(/^\?/, ""))).map(([k, v]) => [k, JSON.parse(v)])
  ]);
}

export function getTotal(widget) {
  return (widget && widget.response && widget.response.hits && widget.response.hits.total) || 0;
}

export function getHits(widget) {
  return (widget && widget.response && widget.response.hits && widget.response.hits.hits) || [];
}

export function getAggregations(widget, name) {
  return (
    (widget &&
      widget.response &&
      widget.response.aggregations &&
      widget.response.aggregations[name] &&
      widget.response.aggregations[name].buckets) ||
    []
  );
}

// Todo: clean this ugly funtion
export function toUrlQueryString(params) {
  return qs.stringify(
    Object.fromEntries(
      new Map(
        Array.from(params)
          .filter(([_k, v]) => (Array.isArray(v) ? v.length : v))
          .map(([k, v]) => [k, JSON.stringify(v)])
      )
    )
  );
}

const resolved = Promise.resolve();
export const defer = f => {
  resolved.then(f);
};
