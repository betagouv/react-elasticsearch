import fetch from "unfetch";
import qs from "qs";

// Search with msearch to elasticsearch instance
// Todo reject.
export function msearch(url, query) {
  return new Promise(async (resolve, reject) => {
    const rawResponse = await fetch(`${url}/_msearch`, {
      method: "POST",
      headers: { Accept: "application/json", "Content-Type": "application/x-ndjson" },
      body: `{}\n${JSON.stringify(query)}\n`
    });
    const response = await rawResponse.json();
    resolve(response);
  });
}

// Build a query from a Map of queries
export function queryFrom(queries) {
  return { bool: { must: queries.size === 0 ? { match_all: {} } : Array.from(queries.values()) } };
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

// Todo: clean this ugly funtion
export function toUrlQueryString(params) {
  console.log(Array.from(params));
  return qs.stringify(
    Object.fromEntries(
      new Map(
        Array.from(params)
          .filter(([k, v]) => Array.isArray(v) ? v.length : v )
          .map(([k, v]) => [k, JSON.stringify(v)])
      )
    )
  );
}
