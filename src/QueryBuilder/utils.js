export function ruleQuery(key, operator, value) {
  if (operator === "∃") {
    // { value: "∃", text: "exists" },
    return {
      bool: {
        // Must exists ...
        must: { exists: { field: key } },
        // ... and must be not empty.
        must_not: { term: { [key]: "" } }
      }
    };
  } else if (operator === "!∃") {
    // { value: "!∃", text: "n'existe pas" }
    return {
      bool: {
        // Should be ...
        should: [
          // ... empty string ...
          { term: { [key]: "" } },
          // ... or not exists.
          { bool: { must_not: { exists: { field: key } } } }
        ]
      }
    };
  } else if (operator === "==" && value) {
    // { value: "==", text: "égal à" },
    return { term: { [key]: value } };
  } else if (operator === "!=" && value) {
    // { value: "!=", text: "différent de" },
    return {
      must_not: { term: { [key]: value } }
    };
  } else if (operator === ">=" && value) {
    // { value: ">=", text: "supérieur ou égal à" },
    return { range: { [key]: { gte: value } } };
  } else if (operator === "<=" && value) {
    // { value: "<=", text: "inférieur ou égal à" },
    return { range: { [key]: { lte: value } } };
  } else if (operator === "<" && value) {
    // { value: "<", text: "strictement inférieur à" },
    return { range: { [key]: { lt: value } } };
  } else if (operator === ">" && value) {
    // { value: ">", text: "strictement supérieur à" },
    return { range: { [key]: { gt: value } } };
  } else if (operator === "^" && value) {
    // { value: "^", text: "commence par" }
    return { wildcard: { [key]: `${value}*` } };
  } else if (operator === "*" && value) {
    // { value: "*", text: "contient" }
    return {
      wildcard: { [key]: `*${value}*` }
    };
  } else {
    return null;
  }
}

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
  { value: "==", text: "equals", useInput: true },
  { value: "!=", text: "not equals", useInput: true },
  { value: ">=", text: "greater than or equals to", useInput: true },
  { value: "<=", text: "lesser than or equals to", useInput: true },
  { value: ">", text: "greater than", useInput: true },
  { value: "<", text: "lesser than", useInput: true },
  { value: "∃", text: "exists", useInput: false },
  { value: "!∃", text: "does not exist", useInput: false },
  { value: "*", text: "contains", useInput: true },
  { value: "^", text: "start with", useInput: true }
];

export const defaultCombinators = [{ value: "AND", text: "AND" }, { value: "OR", text: "OR" }];
