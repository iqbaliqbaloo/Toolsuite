export function fmtBytes(n: number | string): string {
  const v = parseInt(String(n)) || 0;
  if (!v) return '0 B';
  const k = 1024, s = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(Math.abs(v)) / Math.log(k));
  return (v / Math.pow(k, i)).toFixed(1) + ' ' + s[i];
}

export function dlBlob(blob: Blob, name: string): void {
  const url = URL.createObjectURL(blob);
  const a = Object.assign(document.createElement('a'), { href: url, download: name });
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
