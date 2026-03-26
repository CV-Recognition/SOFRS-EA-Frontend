// Source - https://stackoverflow.com/a/79333514
// Posted by PRABHAKAR NAYAK, modified by community. See post 'Timeline' for change history
// Retrieved 2026-03-26, License - CC BY-SA 4.0

import nodeExternals from "webpack-node-externals";

export default {
    target: "node",
    externals: [nodeExternals()],
};
