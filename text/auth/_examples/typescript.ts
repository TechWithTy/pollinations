// Auth-focused examples for the local proxy route: /api/pollinations/text/auth
// Demonstrates Referrer (frontend) and Bearer (backend) usage.

export async function callAuthWithReferrer() {
  const res = await fetch("/api/pollinations/text/auth?referrer=mywebapp.com", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "openai",
      messages: [{ role: "user", content: "Say hello in one sentence." }],
    }),
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function callAuthWithBearer(token: string) {
  const res = await fetch("/api/pollinations/text/auth", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ model: "openai", messages: [{ role: "user", content: "Who are you?" }] }),
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

// Usage in browser:
// await callAuthWithReferrer();
// await callAuthWithBearer("YOUR_TOKEN");
/**
 * Guidance
 * - Frontend (Referrer): pass ?referrer=mywebapp.com to local proxy calls,
 *   or rely on browser's Referer header. Never put tokens in frontend.
 * - Backend (Bearer): set Authorization: Bearer YOUR_TOKEN when calling upstream
 *   or when using our local proxy from a trusted server.
 */
