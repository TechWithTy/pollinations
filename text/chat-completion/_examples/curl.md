# Pollinations Chat Completion Examples (cURL)

## Basic JSON (non-streaming)

```bash
curl http://localhost:3000/api/pollinations/text/chat-completion \
  -H "Content-Type: application/json" \
  -d '{
    "model": "openai",
    "messages": [
      {"role": "system", "content": "You are a helpful assistant."},
      {"role": "user", "content": "What is the capital of France?"}
    ],
    "seed": 42
  }'
```

## Function Calling (tools)

```bash
curl http://localhost:3000/api/pollinations/text/chat-completion \
  -H "Content-Type: application/json" \
  -d '{
    "model": "openai",
    "messages": [{"role": "user", "content": "What is the weather like in Boston?"}],
    "tools": [
      {
        "type": "function",
        "function": {
          "name": "get_current_weather",
          "description": "Get the current weather in a given location",
          "parameters": {
            "type": "object",
            "properties": {
              "location": {"type": "string", "description": "City and state"},
              "unit": {"type": "string", "enum": ["celsius", "fahrenheit"]}
            },
            "required": ["location"]
          }
        }
      }
    ],
    "tool_choice": "auto"
  }'
```

## Streaming (SSE)

```bash
curl -N http://localhost:3000/api/pollinations/text/chat-completion \
  -H "Content-Type: application/json" \
  -d '{
    "model": "openai",
    "messages": [
      {"role": "user", "content": "Write a short poem about the sea."}
    ],
    "stream": true
  }'
```
