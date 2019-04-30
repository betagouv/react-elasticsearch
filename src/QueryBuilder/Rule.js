import React, { useState, useEffect } from "react";

export default function Rule({ fields, operators, combinators, ...props }) {
  const [combinator, setCombinator] = useState(props.combinator);
  const [field, setField] = useState(props.field);
  const [operator, setOperator] = useState(props.operator);
  const [value, setValue] = useState(props.value);

  useEffect(() => {
    props.onChange({ field, operator, value, combinator, index: props.index });
  }, [field, operator, value, combinator]);

  const combinatorElement = props.index ? (
    <select value={combinator.value} onChange={e => setCombinator(e.target.value)}>
      {combinators.map(c => (
        <option key={c.value} value={c.value}>
          {c.text}
        </option>
      ))}
    </select>
  ) : null;

  const deleteButton = props.index ? (
    <button onClick={() => props.onDelete(props.index)}>Delete</button>
  ) : null;

  return (
    <div>
      {combinatorElement}
      <select value={field.value} onChange={e => setField(e.target.value)}>
        {fields.map(f => {
          return (
            <option key={f.value} value={f.value}>
              {f.text}
            </option>
          );
        })}
      </select>
      <select value={operator.value} onChange={e => setOperator(e.target.value)}>
        {operators.map(o => {
          return (
            <option key={o.value} value={o.value}>
              {o.text}
            </option>
          );
        })}
      </select>
      <input value={value} onChange={e => setValue(e.target.value)} />
      <button onClick={props.onAdd}>Add</button>
      {deleteButton}
    </div>
  );
}
