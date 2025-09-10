# Authentication & Tiers 🔑

Pollinations.AI offers flexible authentication methods tailored to your application's needs.

- Authentication is optional for many use cases.
- Registering your application unlocks faster response times, higher rate limits, and advanced features.

## Getting Started

Visit https://auth.pollinations.ai to:

- Set up and register your application's referrer
- Create API tokens for backend applications
- Manage your authentication settings

Security Best Practice: never expose API tokens in frontend code. Frontend web applications should rely on referrer-based authentication.

## Authentication Methods

### Referrer (Frontend)

For web apps calling APIs directly from the browser, a valid referrer is sufficient.

- Browsers automatically send the `Referer` header.
- Optionally add `?referrer=your-app-identifier` to API requests.
- Registered referrers get higher rate limits and priority access.
- No token in the browser.

Examples:

```text
https://image.pollinations.ai/prompt/a%20beautiful%20landscape?referrer=mywebapp.com
```

Local proxy with explicit referrer:

```bash
curl "http://localhost:3000/api/pollinations/text/auth?referrer=mywebapp.com" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "openai",
    "messages": [{"role":"user","content":"Say hello"}]
  }'
```

### Token (Backend)

For backend services, scripts, and server applications, tokens provide priority access.

Send tokens via:

- Authorization header (recommended): `Authorization: Bearer YOUR_TOKEN`
- Query parameter: `?token=YOUR_TOKEN`
- Request body JSON: `{ "token": "YOUR_TOKEN" }`

Bearer auth (OpenAI-compatible endpoint):

```bash
curl https://text.pollinations.ai/openai \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "model": "openai",
    "messages": [{"role": "user", "content": "Tell me about yourself."}]
  }'
```

Local proxy (token forwarded):

```bash
curl "http://localhost:3000/api/pollinations/text/auth" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "model": "openai",
    "messages": [{"role": "user", "content": "Tell me about yourself."}]
  }'
```

## Tiers & Rate Limits

| Tier      | Rate Limit | Model Pack | Description |
|-----------|------------|------------|-------------|
| anonymous | 15 seconds | Limited    | Default tier for unauthenticated requests |
| Seed      | 5 seconds  | Standard   | Registered apps via auth.pollinations.ai |
| Flower    | 3 seconds  | Advanced   | Faster limits and more models |
| Nectar    | None       | Advanced   | Unlimited usage; enterprise/high-volume |

How to access tiers:

- Seed: register your referrer or create a token at https://auth.pollinations.ai
- Flower & Nectar: available via https://auth.pollinations.ai

## API Update (starting 2025-03-31) 📅

- Generate Image responses may include the Pollinations.AI logo 🖼️. Registered users can disable with `nologo=true`.
- Generate Text responses may include a link to pollinations.ai 🔗. This may be adjusted or removed for higher tiers.

Best experience:

- Web apps: register your referrer at https://auth.pollinations.ai
- Backend services: use API tokens (Bearer) instead of referrers
