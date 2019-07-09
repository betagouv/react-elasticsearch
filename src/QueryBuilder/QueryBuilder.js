import React, { useState, useEffect } from "react";
import { useSharedContext } from "../SharedContextProvider";
import {
  defaultOperators,
  defaultCombinators,
  mergedQueries,
  uuidv4,
  withUniqueKey
} from "./utils";
import Rule from "./Rule";

export default function QueryBuilder({
  fields,
  operators,
  combinators,
  templateRule,
  initialValue,
  id,
  autoComplete
}) {
  const [, dispatch] = useSharedContext();
  operators = operators || defaultOperators;
  combinators = combinators || defaultCombinators;
  templateRule = templateRule || {
    field: fields[0].value,
    operator: operators[0].value,
    value: "",
    combinator: "AND",
    index: 0
  };
  const [rules, setRules] = useState(withUniqueKey(initialValue || [templateRule]));

  useEffect(() => {
    const queries = mergedQueries(
      rules.map(r => ({
        ...r,
        query: operators.find(o => o.value === r.operator).query(r.field, r.value)
      }))
    );
    dispatch({
      type: "setWidget",
      key: id,
      needsQuery: true,
      needsConfiguration: false,
      isFacet: false,
      wantResults: false,
      query: { bool: queries },
      value: rules.map(r => ({
        field: r.field,
        operator: r.operator,
        value: r.value,
        combinator: r.combinator,
        index: r.index
      })),
      configuration: null,
      result: null
    });
  }, [JSON.stringify(rules)]);

  // Destroy widget from context (remove from the list to unapply its effects)
  useEffect(() => () => dispatch({ type: "deleteWidget", key: id }), []);

  return (
    <div className="react-es-query-builder">
      {rules.map(rule => (
        <Rule
          combinator={rule.combinator}
          field={rule.field}
          operator={rule.operator}
          value={rule.value}
          fields={fields}
          operators={operators}
          combinators={combinators}
          key={rule.key}
          index={rule.index}
          autoComplete={autoComplete}
          onAdd={() => {
            setRules([...rules, { ...templateRule, index: rules.length, key: uuidv4() }]);
          }}
          onDelete={index => {
            setRules(
              rules
                .filter(e => e.index !== index)
                .filter(e => e)
                .map((v, k) => ({ ...v, index: k }))
            );
          }}
          onChange={r => {
            rules[r.index] = { ...r, key: rules[r.index].key };
            setRules([...rules]);
          }}
        />
      ))}
    </div>
  );
}
