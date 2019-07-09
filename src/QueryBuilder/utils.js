export function mergedQueries(queries) {
  let obj = { must: [], must_not: [], should: [], should_not: [] };
  queries
    .filter(q => q.query)
    .forEach((q, k) => {
      let combinator = q.combinator;
      if (k === 0) {
        combinator = queries.length === 1 ? "AND" : queries[1].combinator;
      }
      obj[combinator === "AND" ? "must" : "should"].push(q.query);
    });
  return obj;
}

function query(key, value, cb, shouldOrMust = "should") {
  if (Array.isArray(key)) {
    return { bool: { [shouldOrMust]: key.map(k => cb(k, value)) } };
  }
  return cb(key, value);
}

export const defaultOperators = [
  {
    value: "==",
    text: "equals",
    useInput: true,
    query: (key, value) => value && query(key, value, (k, v) => ({ term: { [k]: v } }))
  },
  {
    value: "!=",
    text: "not equals",
    useInput: true,
    query: (key, value) =>
      value && query(key, value, (k, v) => ({ bool: { must_not: { term: { [k]: v } } } }), "must")
  },
  {
    value: ">=",
    text: "greater than or equals to",
    useInput: true,
    query: (key, value) => value && query(key, value, (k, v) => ({ range: { [k]: { gte: v } } }))
  },
  {
    value: "<=",
    text: "lesser than or equals to",
    useInput: true,
    query: (key, value) => value && query(key, value, (k, v) => ({ range: { [k]: { lte: v } } }))
  },
  {
    value: ">",
    text: "greater than",
    useInput: true,
    query: (key, value) => value && query(key, value, (k, v) => ({ range: { [k]: { gt: v } } }))
  },
  {
    value: "<",
    text: "lesser than",
    useInput: true,
    query: (key, value) => value && query(key, value, (k, v) => ({ range: { [k]: { lt: v } } }))
  },
  {
    value: "∃",
    text: "exists",
    useInput: false,
    query: key =>
      query(key, null, k => ({
        bool: {
          // Must exists ...
          must: { exists: { field: k } },
          // ... and must be not empty.
          must_not: { term: { [k]: "" } }
        }
      }))
  },
  {
    value: "!∃",
    text: "does not exist",
    useInput: false,
    query: key =>
      query(
        key,
        null,
        k => ({
          bool: {
            // Should be ...
            should: [
              // ... empty string ...
              { term: { [k]: "" } },
              // ... or not exists.
              { bool: { must_not: { exists: { field: k } } } }
            ]
          }
        }),
        "must"
      )
  },
  {
    value: "*",
    text: "contains",
    useInput: true,
    query: (key, value) => value && query(key, value, (k, v) => ({ wildcard: { [k]: `*${v}*` } }))
  },
  {
    value: "!*",
    text: "does not contains",
    useInput: true,
    query: (key, value) =>
      value &&
      query(key, value, (k, v) => ({ bool: { must_not: { wildcard: { [k]: `*${v}*` } } } }), "must")
  },
  {
    value: "^",
    text: "start with",
    useInput: true,
    query: (key, value) => value && query(key, value, (k, v) => ({ wildcard: { [k]: `${v}*` } }))
  }
];

export const defaultCombinators = [{ value: "AND", text: "AND" }, { value: "OR", text: "OR" }];

export function uuidv4() {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, c => {
    const r = (Math.random() * 16) | 0,
      v = c == "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}
export function withUniqueKey(rules) {
  return rules.map(r => ({ ...r, key: uuidv4() }));
}
