export const API_URL = 'http://localhost:8000';

function buildError(status, detail) {
  const err = new Error(typeof detail === 'string' ? detail : `Erro ${status}`);
  err.status = status;
  // 409 conflict: { field, message }
  if (detail && typeof detail === 'object' && !Array.isArray(detail)) {
    err.field = detail.field ?? null;
    err.message_detail = detail.message ?? null;
  }
  // 422 validation: [{ loc: ["body", "field"], msg: "Value error, ..." }]
  if (Array.isArray(detail)) {
    err.fieldErrors = {};
    detail.forEach(e => {
      const field = e.loc?.[e.loc.length - 1];
      const msg = (e.msg ?? '').replace(/^Value error,\s*/i, '');
      if (field && typeof field === 'string') err.fieldErrors[field] = msg;
    });
  }
  return err;
}

export async function request(path, options = {}) {
  const res = await fetch(`${API_URL}${path}`, {
    cache: 'no-store',
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });
  if (!res.ok) {
    let body = null;
    try { body = await res.json(); } catch {}
    throw buildError(res.status, body?.detail ?? null);
  }
  if (res.status === 204) return null;
  return res.json();
}

export async function authRequest(path, options = {}) {
  const token = localStorage.getItem('token');
  const res = await fetch(`${API_URL}${path}`, {
    cache: 'no-store',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    ...options,
  });
  if (!res.ok) {
    let body = null;
    try { body = await res.json(); } catch {}
    throw buildError(res.status, body?.detail ?? null);
  }
  if (res.status === 204) return null;
  return res.json();
}
console.log(localStorage.getItem('token'));