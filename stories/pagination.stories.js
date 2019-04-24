import React from "react";
import { storiesOf } from "@storybook/react";
import { action } from "@storybook/addon-actions";
import { Pagination } from "../src";

storiesOf("Pagination", module).add("with various status", () => {
  const paginations = [1, 3, 5, 12, 35, 38, 40].map(i => (
    <div style={{ display: "inline-block", verticalAlign: "top", marginRight: "20px" }} key={i}>
      <h3>On page {i}</h3>
      <Pagination onChange={action("page changed")} total={200} itemsPerPage={5} page={i} />
    </div>
  ));
  return (
    <div>
      {paginations}
      <Pagination onChange={action("page changed")} total={11} itemsPerPage={5} page={1} />
    </div>
  );
});
