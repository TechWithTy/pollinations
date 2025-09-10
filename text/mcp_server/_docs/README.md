# Pollinations MCP Server for AI Assistants 🤖🔧

Pollinations provides an MCP (Model Context Protocol) server that enables AI assistants (e.g., Anthropic Claude with tools) to generate images, audio, and text via structured tool calls. This allows assistants to autonomously invoke creative/generative capabilities within multi-step workflows.

- Server Name: `pollinations-multimodal-api`
- Docs: https://github.com/pollinations/pollinations/blob/master/model-context-protocol/README.md

## Available Tools

### Image Tools
- `generateImageUrl`: Generate an image and return its publicly accessible URL.
- `generateImage`: Generate an image and return base64-encoded image data.
- `listImageModels`: List available image generation models.

### Audio Tools
- `respondAudio`: Generate an audio response from text (client-side playback typical).
- `sayText`: Generate speech that pronounces the provided text verbatim.
- `listAudioVoices`: List available voices for audio generation.

### Text Tools
- `listTextModels`: List available text models.

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
