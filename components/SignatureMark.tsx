// The brand's signature mark, as a single filled shape (tapering ribbon —
// thick through the "A", thinning out along the cursive tail) rather than a
// constant-width stroke. Built by sampling the original hand-drawn stroke
// path's on-curve points and offsetting each one perpendicular to the
// stroke direction by a tapering half-width, then closing top and bottom
// edges into one polygon. Reused wherever the signature mark appears (hero,
// CTA band) so it stays one consistent asset instead of copies drifting
// apart.
export default function SignatureMark({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 320 110" fill="none" aria-hidden="true" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M21.39,92.57 L51.94,20.5 L64.29,50.95 L62.71,51.68 L72.75,57.8 L88.73,94.32 L125.5,66.96 L143.64,92.98 L178.61,62.43 L210.47,69.58 L217.03,91.75 L278.23,73.58 L302.76,72.38 L291.45,79.17 L292.55,80.83 L305.24,71.62 L277.77,70.42 L218.97,88.25 L213.53,66.42 L177.39,57.58 L144.36,87.02 L126.5,61.04 L91.27,85.68 L79.26,50.2 L53.29,48.32 L71.71,59.05 L52.06,7.5 L18.61,91.43 Z"
        fill="var(--accent)"
      />
    </svg>
  );
}
