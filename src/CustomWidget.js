import React from "react";
import { useSharedContext } from "./SharedContextProvider";

export default function({ children }) {
  const [ctx, dispatch] = useSharedContext();
  return <>{React.Children.map(children, child => React.cloneElement(child, { ctx, dispatch }))}</>;
}
