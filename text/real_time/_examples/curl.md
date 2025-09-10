# Real-time Feeds (SSE) – cURL Examples

## Image Feed (local proxy)

```bash
curl -N "http://localhost:3000/api/pollinations/text/mcp_server%20copy%202?feed=image&referrer=mywebapp.com"
```

## Text Feed (local proxy)

```bash
curl -N "http://localhost:3000/api/pollinations/text/mcp_server%20copy%202?feed=text"
```

## Upstream (direct)

```bash
# Image feed
curl -N "https://image.pollinations.ai/feed"

# Text feed
curl -N "https://text.pollinations.ai/feed"
```

Notes:
- Use `-N` to disable output buffering for SSE.
- You may append `&referrer=mywebapp.com` when using the local proxy.
