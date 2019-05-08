import React from "react";
import { useSharedContext } from "./SharedContextProvider";

export default function({ children }) {
  const [ctx, dispatch] = useSharedContext();
  return <>{React.Children.map(children, child => React.cloneElement(child, { ctx, dispatch }))}</>;
}

// export default function({ children, id }) {
//   if (!id) {
//     console.error("the widget should have an ID");
//     return <div />;
//   }
//   const [ctx, dispatch] = useSharedContext();

//   function updateQuery() {}

//   function onData() {}
//   function onAggr() {}

//   return <>{React.Children.map(children, child => React.cloneElement(child, { ctx, dispatch }))}</>;
// }
