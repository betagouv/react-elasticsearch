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
    query: (key, value) => (value ? { bool: { must_not: { term: { [key]: value } } } } : null)
  },
  {
    value: ">=",
    text: "greater than or equals to",
    useInput: true,
    query: (key, value) => (value ? { range: { [key]: { gte: value } } } : null)
  },
  {
    value: "<=",
    text: "lesser than or equals to",
    useInput: true,
    query: (key, value) => (value ? { range: { [key]: { lte: value } } } : null)
  },
  {
    value: ">",
    text: "greater than",
    useInput: true,
    query: (key, value) => (value ? { range: { [key]: { lt: value } } } : null)
  },
  {
    value: "<",
    text: "lesser than",
    useInput: true,
    query: (key, value) => (value ? { range: { [key]: { gt: value } } } : null)
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
    query: (key, value) => (value ? { wildcard: { [key]: `*${value}*` } } : null)
  },
  {
    value: "!*",
    text: "does not contains",
    useInput: true,
    query: (key, value) =>
      value ? { bool: { must_not: { wildcard: { [key]: `*${value}*` } } } } : null
  },
  {
    value: "^",
    text: "start with",
    useInput: true,
    query: (key, value) => (value ? { wildcard: { [key]: `${value}*` } } : null)
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
