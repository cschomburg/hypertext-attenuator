export { render } from "https://esm.sh/preact@10.6.2";
export * from "https://esm.sh/preact@10.6.2/hooks";
export { Link, Router } from "https://esm.sh/preact-router?deps=preact@10.6.2";

export { default as createStore } from "https://esm.sh/teaful@0.9.2?alias=react:preact/compat&deps=preact@10.6.2";

import { h } from "https://esm.sh/preact@10.6.2";
import htm from "https://esm.sh/htm@3.1.0";

export { default as ky } from "https://esm.sh/ky@0.28.7";
export { formatDistanceToNow, parseISO } from "https://esm.sh/date-fns@2.27.0";

export const html = htm.bind(h);
