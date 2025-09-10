# Pollinations MCP Usage (Project Examples)

> MCP connections are not made over cURL in this project. Instead, we connect via the MCP SDK (HTTP or STDIO transport) using environment variables. Below are examples to run locally.

## 1) Environment

HTTP (remote/local MCP server):

```bash
# .env
MCP_SERVER_URL=http://localhost:8000/mcp
MCP_AUTH_TOKEN=your_token
      {
        "role": "user",
        "content": [
          {"type": "text", "text": "Describe this image"},
          {"type": "image_url", "image_url": {"url": "data:image/jpeg;base64,REPLACE_WITH_CONTENTS_OF_photo.b64"}}
        ]
      }
    ]
  }'
```
