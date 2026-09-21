export function formatKc(value: number): string {
  return `${new Intl.NumberFormat("cs-CZ").format(Math.round(value))} Kč`;
}

export function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  const kb = bytes / 1024;
  if (kb < 1024) return `${kb.toFixed(kb < 10 ? 1 : 0)} kB`;
  return `${(kb / 1024).toFixed(1)} MB`;
}
