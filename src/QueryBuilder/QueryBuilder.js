import React, { useState, useEffect } from "react";
import { useSharedContext } from "../SharedContextProvider";
import { defaultOperators, defaultCombinators, mergedQueries, ruleQuery } from "./utils";
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
  const [rules, setRules] = useState(initialValue || [templateRule]);

  useEffect(() => {
    const queries = mergedQueries(
      rules.map(r => ({ ...r, query: ruleQuery(r.field, r.operator, r.value) }))
    );
    dispatch({
      type: "setWidget",
      key: id,
      needsQuery: true,
      needsConfiguration: false,
      isFacet: false,
      wantResults: false,
      query: { bool: queries },
      value: rules,
      configuration: null,
      result: null
    });
  }, [JSON.stringify(rules)]);

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
          key={rule.index}
          index={rule.index}
          autoComplete={autoComplete}
          onAdd={() => {
            setRules([...rules, { ...templateRule, index: rules.length }]);
          }}
          onDelete={index => {
            delete rules[index];
            setRules(rules.filter(e => e).map((v, k) => ({ ...v, index: k })));
          }}
          onChange={r => {
            rules[r.index] = r;
            setRules([...rules]);
          }}
        />
      ))}
    </div>
  );
}
