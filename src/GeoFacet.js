import React, { useState, useEffect } from "react";
import { toTermQueries } from "./utils";
import { useSharedContext } from "./SharedContextProvider";

export default function ({
    fields,
    id,
    initialValue,
    seeMore,
    placeholder,
    showFilter = true,
    filterValueModifier,
    items
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
    const [q, setQ] = useState(true);
    const pq = q? {"geo_bounding_box":{"point_location":{"top_left":{"lat":"56.001111490713704","lon":"5.239240457720005"},"bottom_right":{"lat":"44.87490315978512","lon":"13.720685770220006"}}}}: { bool: { should: [] } }

    // Update widgets properties on state change.
    useEffect(() => {
        dispatch({
            type: "setWidget",
            key: id,
            needsQuery: true,
            needsConfiguration: true,
            isFacet: true,
            wantResults: false,
            query: pq,
            value,
            configuration: { size, filterValue, fields, filterValueModifier },
            result: data && total ? { data, total } : null
        });
    }, [size, filterValue, value, q]);

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

    // On checkbox status change, add or remove current agg to selected
    function handleChange(item, checked) {
        const newValue = checked
            ? [...new Set([...value, item.key])]
            : value.filter(f => f !== item.key);
        setValue(newValue);
    }

    // Is current item checked?
    function isChecked(item) {
        return value.includes(item.key);
    }

    return (
        <div className="react-es-facet">
            <button onClick={() => setQ(!q)}>hello</button>

        </div>
    );
}

