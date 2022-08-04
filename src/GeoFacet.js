import React, { useState, useEffect } from "react";
import { toTermQueries } from "./utils";
import { useSharedContext } from "./SharedContextProvider";
import { isArray } from "lodash";

const constructGeoQuery = (field, shapeValue) => {
    if (Array.isArray(shapeValue)) {
        return { bool: { should: [] } }
    } else {
        return {
            geo_shape: {
                [field]: {
                    shape: shapeValue,
                    relation: "within"
                },
            }
        }
    }
}

export default function ({
    id,
    initialValue,
    field
}) {
    const [{ widgets }, dispatch] = useSharedContext();
    // Current filter (search inside facet value).
    const [filterValue, setFilterValue] = useState("");
    // Number of itemns displayed in facet.
    const [size, setSize] = useState(1);
    // The actual selected items in facet.
    const [value, setValue] = useState(initialValue || []);
    // Data from internal queries (Elasticsearch queries are performed via Listener)
    const { result } = widgets.get(id) || {};
    const data = (result && result.data) || [];
    const total = (result && result.total) || 0;
    const query = constructGeoQuery(field, value)

    // Update widgets properties on state change.
    useEffect(() => {
        dispatch({
            type: "setWidget",
            key: id,
            needsQuery: true,
            needsConfiguration: true,
            isFacet: true,
            wantResults: false,
            query: query,
            value,
            configuration: { size, filterValue, fields: ["foo.baz"], undefined },
            result: data && total ? { data, total } : null
        });
    }, [size, filterValue, value]);

    // only update value if the provided value (initialValue) is different from the current
    useEffect(() => {
        if (JSON.stringify(initialValue) != JSON.stringify(value)) {
            setValue(initialValue)
        }
    })

    // If widget value was updated elsewhere (ex: from active filters deletion)
    // We have to update and dispatch the component.
    useEffect(() => {
        widgets.get(id) && setValue(widgets.get(id).value);
    }, [isValueReady()]);

    // Destroy widget from context (remove from the list to unapply its effects)
    useEffect(() => () => dispatch({ type: "deleteWidget", key: id }), []);

    // Checks if widget value is the same as actual value.
    function isValueReady() {
        return !widgets.get(id) || widgets.get(id).value == value;
    }
    return (
        <div className="react-es-facet">
        </div>
    );
}

