import cs from "./cs";

// Single active locale for now — swap this export for a real lookup (cookie,
// Accept-Language, /en route prefix…) once a second locale actually ships.
const t = cs;

export default t;
export type { Dictionary } from "./types";
