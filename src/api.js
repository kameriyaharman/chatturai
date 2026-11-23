// Where the enquiry API lives. Same origin on Railway; set VITE_API_BASE at build time
// (e.g. https://website-production-52a6b99b.up.railway.app) if the pages are hosted elsewhere.
export const API_BASE = (import.meta.env.VITE_API_BASE || '').replace(/\/+$/, '');

/** Save a lead to the enquiry admin. Never throws — resolves true/false. */
export async function saveEnquiry(data) {
  try {
    const r = await fetch(API_BASE + '/api/enquiries', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...data, page_url: location.href }),
      keepalive: true,
    });
    return r.ok;
  } catch {
    return false;
  }
}
