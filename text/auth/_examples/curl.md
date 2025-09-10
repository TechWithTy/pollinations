# Pollinations Authentication – cURL Examples

These examples demonstrate Referrer-based auth for browsers and Bearer token auth for backends. Use whichever fits your app. For most frontend apps, Referrer is recommended. For backend services, use Bearer tokens.

## Referrer (Frontend)

Browsers automatically send the Referer header. You can also add an explicit `referrer` query param.

- Direct image generation (explicit referrer):

```bash
curl "https://image.pollinations.ai/prompt/a%20beautiful%20landscape?referrer=mywebapp.com"
```

- Using this project's local auth proxy with explicit referrer:

```bash
curl "http://localhost:3000/api/pollinations/text/auth?referrer=mywebapp.com" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "openai",
    "messages": [{"role": "user", "content": "Say hello in one sentence."}]
  }'
```

## Bearer Token (Backend)

Send a token with the Authorization header. Recommended for OpenAI-compatible text endpoints.

- Direct upstream:

```bash
curl https://text.pollinations.ai/openai \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "model": "openai",
    "messages": [{"role": "user", "content": "Tell me about yourself."}]
  }'
```

- Using this project's local auth proxy (token forwarded):

```bash
curl "http://localhost:3000/api/pollinations/text/auth" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "model": "openai",
    "messages": [{"role": "user", "content": "Tell me about yourself."}]
  }'
```

## Notes

- Register referrers and manage tokens at: https://auth.pollinations.ai
- Never expose tokens in frontend code. Use Referrer auth for browser apps.
- The local proxy forwards `Authorization` and `referrer` to upstream.
