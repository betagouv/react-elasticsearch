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
    console.log("msearchData", msearchData);
    const body = msearchData.reduce((acc, val) => {
      const [p, q] = [{ preference: val.id }, queryFrom(val.queries)].map(JSON.stringify);
      return `${acc}${p}\n${q}\n`;
    }, "");

    console.log("body", body);
    const rawResponse = await fetch(`${url}/_msearch`, { method: "POST", headers, body });
    const response = await rawResponse.json();
    resolve(response);
  });
}

// Build a query from a Map of queries
export function queryFrom(queries) {
  console.log("MERGE THIS", queries);
  if (queries.length === 0) {
    return { match_all: {} };
  } else if (queries.length === 1) {
    return queries[0];
  } else {
  }
  // return { bool: { must: queries.size === 0 ? { match_all: {} } : Array.from(queries.values()) } };
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
