export const runtime = "edge";

// POST /api/pollinations/text/vision copy
// OpenAI-compatible JSON proxy to: https://text.pollinations.ai/openai
// Supports regular chat, Vision-style messages (image_url), and Function Calling (tools/tool_calls) payloads.
// Note: For Function Calling we recommend using the chat-completion route
// (/api/pollinations/text/chat-completion) which is the canonical endpoint in this app.
export async function POST(req: Request) {
	let body: unknown;
	try {
		body = await req.json();
	} catch {
		return new Response(
			JSON.stringify({ error: { message: "Invalid JSON body" } }),
			{
				status: 400,
				headers: { "Content-Type": "application/json" },
			},
		);
	}

	const b = body as { messages?: unknown } | null;
	if (!b || !Array.isArray(b.messages)) {
		return new Response(
			JSON.stringify({ error: { message: "Missing messages[] in body" } }),
			{
				status: 400,
				headers: { "Content-Type": "application/json" },
			},
		);
	}

	try {
		const upstream = await fetch("https://text.pollinations.ai/openai", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(b),
		});

		const text = await upstream.text();
		return new Response(text, {
			status: upstream.status,
			headers: {
				"Content-Type":
					upstream.headers.get("Content-Type") || "application/json",
			},
		});
	} catch (e: unknown) {
		return new Response(
			JSON.stringify({ error: { message: (e as Error).message } }),
			{
				status: 502,
				headers: { "Content-Type": "application/json" },
			},
		);
	}
}

// GET /api/pollinations/text/mcp_server copy 2?feed=image|text&referrer=...
// Proxies Server-Sent Events (SSE) feeds from Pollinations upstream.
export async function GET(req: Request) {
  const incoming = new URL(req.url);
  const feed = (incoming.searchParams.get("feed") || "text").toLowerCase();
  const ref = incoming.searchParams.get("referrer");

  const upstreamBase = feed === "image"
    ? "https://image.pollinations.ai/feed"
    : "https://text.pollinations.ai/feed";

  const upstreamUrl = new URL(upstreamBase);
  if (ref) upstreamUrl.searchParams.set("referrer", ref);

  try {
    const upstream = await fetch(upstreamUrl.toString(), {
      method: "GET",
      headers: {
        Accept: "text/event-stream",
        Connection: "keep-alive",
        "Cache-Control": "no-cache",
      },
    });

    if (!upstream.body) {
      return new Response("Upstream did not return a stream", { status: 502 });
    }

    // Pass-through SSE stream
    return new Response(upstream.body, {
      status: upstream.status,
      headers: {
        "Content-Type": upstream.headers.get("Content-Type") || "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
        "Transfer-Encoding": "chunked",
      },
    });
  } catch (e: unknown) {
    return new Response(
      JSON.stringify({ error: { message: (e as Error).message } }),
      { status: 502, headers: { "Content-Type": "application/json" } },
    );
  }
}
