

## Real-time Feeds API 🔄

Read-only Server-Sent Events (SSE) feeds that stream public activity on Pollinations.AI.

### 1) Image Feed 🖼️📈

- Upstream: `GET https://image.pollinations.ai/feed`
- Local proxy: `GET /api/pollinations/text/mcp_server copy 2?feed=image[&referrer=...]`

Each `data:` line contains JSON, e.g.:

```json
{
  "width": 1024,
  "height": 1024,
  "seed": 42,
  "model": "flux",
  "imageURL": "https://image.pollinations.ai/prompt/a_radiant_visage...",
  "prompt": "A radiant visage in the style of renaissance painting"
}
```

### 2) Text Feed 📝📈

- Upstream: `GET https://text.pollinations.ai/feed`
- Local proxy: `GET /api/pollinations/text/mcp_server copy 2?feed=text[&referrer=...]`

Each `data:` line contains JSON, e.g.:

```json
{
  "response": "Cherry Blossom Pink represents gentleness...",
  "model": "openai",
  "messages": [{ "role": "user", "content": "What does the color ...?" }]
}
```

### cURL (SSE)

```bash
# Image feed via local proxy (explicit referrer optional)
curl -N "http://localhost:3000/api/pollinations/text/mcp_server%20copy%202?feed=image&referrer=mywebapp.com"

# Text feed via local proxy
curl -N "http://localhost:3000/api/pollinations/text/mcp_server%20copy%202?feed=text"
```

### TypeScript (SSE)

```ts
async function readSse(url: string, onEvent: (json: unknown) => void) {
  const res = await fetch(url, { headers: { Accept: "text/event-stream" } });
  if (!res.body) throw new Error("No SSE body");
  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";
  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });
    let idx;
    while ((idx = buffer.indexOf("\n\n")) >= 0) {
      const chunk = buffer.slice(0, idx);
      buffer = buffer.slice(idx + 2);
      const line = chunk.split("\n").find((l) => l.startsWith("data:"));
      if (!line) continue;
      const payload = line.slice(5).trim();
      if (payload === "[DONE]") return;
      try { onEvent(JSON.parse(payload)); } catch {}
    }
  }
}

// Usage
// await readSse("/api/pollinations/text/mcp_server%20copy%202?feed=image", console.log);
// await readSse("/api/pollinations/text/mcp_server%20copy%202?feed=text", console.log);
```

### General Tools
- `listModels`: List all models with optional filtering by type (e.g., `image`, `text`, `audio`).

## Usage Overview

- Configure your AI assistant to include the MCP server named `pollinations-multimodal-api`.
- Define the tools (per the assistant platform’s tool schema) referencing this server.
- The assistant will call tools according to the conversation context. Your client or orchestration layer should execute these tools via the MCP server and return results to the model.

> Note: Code samples for MCP integration vary by client. See the upstream README for concrete instructions specific to your platform.

## Related

- For OpenAI-compatible Function Calling via HTTP (not MCP), use `POST /api/pollinations/text/chat-completion` with `tools`/`tool_calls` payloads. See the chat-completion examples in this repo.
  "content": "{\"location\":\"Tokyo\",\"temperature\":\"15\",\"unit\":\"celsius\"}"
}
```

## Examples

- cURL: `../_examples/curl.md`
- TypeScript: `../_examples/typescript.ts`

## Notes

- Use `chat-completion` route for function calling; this proxy simply forwards to `https://text.pollinations.ai/openai`.
- Add authentication and rate limiting in your proxy as needed.
- If you introduce API keys or referrer-based controls, add them on the server side here before forwarding to Pollinations.
