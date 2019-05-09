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
  if (queries.length === 0) {
    return { query: { match_all: {} } };
  } else if (queries.length === 1) {
    return queries[0];
  } else {
    return mergeQueries(queries);
    //#https://github.com/appbaseio/reactivecore/blob/master/src/utils/helper.js
  }
  // return { bool: { must: queries.size === 0 ? { match_all: {} } : Array.from(queries.values()) } };
}

function mergeQueries(queries) {
  let query = { query: { bool: { must: [], should: [] } } };
  for (let i = 0; i < queries.length; i++) {
    const q = { ...queries[i] };
    if (q.query.bool) {
      if (q.query.bool.must) {
        query.query.bool.must.push(...q.query.bool.must);
      }
      if (q.query.bool.should && q.query.bool.should.length) {
        query.query.bool.should.push(...q.query.bool.should);
        query.query.bool.minimum_should_match = 1;
      }
    } else {
      query.query.bool.must.push(q.query);
    }

    // we add other queries stuff ( function score, size, aggregations )
    delete q.query;
    query = { ...query, ...q };
  }
  return query;
}

export function isEqual(x, y) {
  if (x === y) return true;
  if (!(x instanceof Object) || !(y instanceof Object)) return false;
  if (x.constructor !== y.constructor) return false;

  for (const p in x) {
    if (!x.hasOwnProperty(p)) continue;
    if (!y.hasOwnProperty(p)) return false;
    if (x[p] === y[p]) continue;
    if (typeof x[p] !== "object") return false;
    if (!isEqual(x[p], y[p])) return false;
  }

  for (const p in y) {
    if (y.hasOwnProperty(p) && !x.hasOwnProperty(p)) return false;
  }
  return true;
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
    ...Object.entries(qs.parse(str.replace(/^\?/, ""))).map(([k, v]) => {
      try {
        return [k, JSON.parse(v)];
      } catch (e) {
        return [k, v]
      }
    })
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
