# Pollinations.AI Integrations for Next.js/TypeScript

Production-ready Pollinations.AI integrations for modern web apps. This module includes authentication (Referrer & Bearer), an OpenAI-compatible text proxy, real-time SSE feeds for image and text activity, and clear docs with cURL/TypeScript examples and tests.

Visit our site: https://www.cyubershoptech.com

## Key Features

- Authentication (Referrer & Bearer)
- OpenAI-compatible text proxy (Edge runtime)
- Real-time Feeds (SSE) for Image & Text
- MCP (Model Context Protocol) helper utilities
- TypeScript-first with examples and tests
- Clear, SEO-friendly documentation

## Quick Start (Next.js / Edge)

- Auth Proxy: `app/api/pollinations/text/auth/route.ts`
- Text Proxy (OpenAI-compatible): `app/api/pollinations/text/chat-completion/route.ts`
- Real-time Feeds (SSE): `app/api/pollinations/text/mcp_server copy 2/route.ts` (GET with `?feed=image|text`)

Install dependencies, then start your Next.js dev server. Use the provided examples under each folder:

- Auth Docs: `app/api/pollinations/text/auth/_docs/README.md`
- Auth cURL Examples: `app/api/pollinations/text/auth/_examples/curl.md`
- Auth TS Examples: `app/api/pollinations/text/auth/_examples/typescript.ts`
- Feeds Docs: `app/api/pollinations/text/mcp_server copy 2/_docs/README.md`
- Feeds cURL Examples: `app/api/pollinations/text/mcp_server copy 2/_examples/curl.md`
- Feeds TS Examples: `app/api/pollinations/text/mcp_server copy 2/_examples/typescript.ts`

## Authentication

- Frontend (Referrer): rely on browser `Referer` or add `?referrer=mywebapp.com`
- Backend (Bearer): send `Authorization: Bearer YOUR_TOKEN`

Register referrers and manage tokens at: https://auth.pollinations.ai

## Real-time Feeds (SSE)

- Image Feed: `GET /api/pollinations/text/mcp_server copy 2?feed=image`
- Text Feed: `GET /api/pollinations/text/mcp_server copy 2?feed=text`

TypeScript example (`readSse`) and cURL usage are provided in the Feeds examples.

## Folder Structure

```
app/api/pollinations/
  README.md
  hooks/
  text/
    auth/
      _docs/ _examples/ _tests/ route.ts
    chat-completion/
    mcp_server copy 2/   # Real-time feeds (SSE) proxy + docs/examples
    ...
```

## SEO Keywords

pollinations, ai, generative-ai, mcp, model-context-protocol, nextjs, typescript, sse, realtime, authentication, bearer, referrer, openai-compatible, text-to-image, image-api, text-api, tts, docs, examples, tests, edge-runtime

## License

MIT
