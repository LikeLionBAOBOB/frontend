// src/components/seatmaps/index.js
import React from "react";

const Map111179 = React.lazy(() => import("./Map111179"));
const Map111051 = React.lazy(() => import("./Map111051"));
const Map111252 = React.lazy(() => import("./Map111252"));
const Map111086 = React.lazy(() => import("./Map111086"));
const Map711596 = React.lazy(() => import("./Map711596"));
const Map111514 = React.lazy(() => import("./Map111514"));
const Map111467 = React.lazy(() => import("./Map111467"));
const Map111257 = React.lazy(() => import("./Map111257"));

export const seatMapById = {
  "111179": Map111179,
  "111051": Map111051,
  "111252": Map111252,
  "111086": Map111086,
  "711596": Map711596,
  "111514": Map111514,
  "111467": Map111467,
  "111257": Map111257,
};
