import React, { useState, useEffect } from "react";
import { useSharedContext } from "./SharedContextProvider";

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
    value,
    field
}) {
    const [{ widgets }, dispatch] = useSharedContext();
    const query = constructGeoQuery(field, value)

    // Update widgets properties on state change.
    useEffect(() => {
        dispatch({
            type: "setWidget",
            key: id,
            needsQuery: true,
            needsConfiguration: true,
            query: query,
            value, 
            configuration: { size: 0, filterValue: "", fields: [field], undefined },
        });
    }, [value]);

    return (
        <div className="react-es-facet">
        </div>
    );
}

