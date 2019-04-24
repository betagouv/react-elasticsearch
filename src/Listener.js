import React, { useEffect } from "react";
import { useSharedContext } from "./SharedContextProvider";

export default function({ onChange, onMount }) {
  const [{ params }, dispatch] = useSharedContext();

  useEffect(() => {
    if (onMount) {
      throw new Error("NOT IMPLEMENTED");
      // onMount(dispatch);
    }
  }, []);
  useEffect(() => {
    onChange && onChange(params);
  });

  return null;
}
