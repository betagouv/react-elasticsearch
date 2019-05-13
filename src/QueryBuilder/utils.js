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

export const defaultOperators = [
  {
    value: "==",
    text: "equals",
    useInput: true,
    query: (key, value) => (value ? { term: { [key]: value } } : null)
  },
  {
    value: "!=",
    text: "not equals",
    useInput: true,
    query: (key, value) => ({ must_not: { term: { [key]: value } } })
  },
  {
    value: ">=",
    text: "greater than or equals to",
    useInput: true,
    query: (key, value) => ({ range: { [key]: { gte: value } } })
  },
  {
    value: "<=",
    text: "lesser than or equals to",
    useInput: true,
    query: (key, value) => ({ range: { [key]: { lte: value } } })
  },
  {
    value: ">",
    text: "greater than",
    useInput: true,
    query: (key, value) => ({ range: { [key]: { lt: value } } })
  },
  {
    value: "<",
    text: "lesser than",
    useInput: true,
    query: (key, value) => ({ range: { [key]: { gt: value } } })
  },
  {
    value: "∃",
    text: "exists",
    useInput: false,
    query: key => ({
      bool: {
        // Must exists ...
        must: { exists: { field: key } },
        // ... and must be not empty.
        must_not: { term: { [key]: "" } }
      }
    })
  },
  {
    value: "!∃",
    text: "does not exist",
    useInput: false,
    query: key => ({
      bool: {
        // Should be ...
        should: [
          // ... empty string ...
          { term: { [key]: "" } },
          // ... or not exists.
          { bool: { must_not: { exists: { field: key } } } }
        ]
      }
    })
  },
  {
    value: "*",
    text: "contains",
    useInput: true,
    query: (key, value) => ({ wildcard: { [key]: `*${value}*` } })
  },
  {
    value: "!*",
    text: "does not contains",
    useInput: true,
    query: (key, value) => ({ bool: { must_not: { wildcard: { [key]: `*${value}*` } } } })
  },
  {
    value: "^",
    text: "start with",
    useInput: true,
    query: (key, value) => ({ wildcard: { [key]: `${value}*` } })
  }
];

export const defaultCombinators = [{ value: "AND", text: "AND" }, { value: "OR", text: "OR" }];
