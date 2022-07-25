import React, { useState, useEffect } from "react";
import { toTermQueries } from "./utils";
import { useSharedContext } from "./SharedContextProvider";

export default function ({
    id,
    filterValueModifier,
}) {
    const [{ widgets }, dispatch] = useSharedContext();

    // Update widgets properties on state change.
    useEffect(() => {
        dispatch({
          type: "setWidget",
          key: id,
          needsQuery: true,
          needsConfiguration: true,
          isFacet: true,
          wantResults: false,
          query: { bool: { should: toTermQueries(fields, value) } },
          value,
          configuration: { size, filterValue, fields, filterValueModifier },
          result: data && total ? { data, total } : null
        });
      }, [size, filterValue, value]);

    return (
        <button>click mee</button>
    )
}

