const API = process.env.NEXT_PUBLIC_API_URL || process.env.VITE_API_URL || '/api/v1';

export async function apiUpload(path: string, fd: FormData): Promise<Response> {
  const r = await fetch(`${API}${path}`, { method: 'POST', body: fd });
  if (!r.ok) {
    const e = await r.json().catch(() => ({}));
    throw new Error(e.message || `HTTP ${r.status}: ${r.statusText}`);
  }
  return r;
}

export async function apiPost<T = unknown>(path: string, body: unknown): Promise<T> {
  const r = await fetch(`${API}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  const j = await r.json();
  if (!j.success) throw new Error(j.message || 'Request failed');
  return j.data as T;
}
