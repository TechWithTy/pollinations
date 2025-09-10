export const runtime = "edge";

// POST /api/pollinations/text/vision copy
// OpenAI-compatible JSON proxy to: https://text.pollinations.ai/openai
// Supports regular chat, Vision-style messages (image_url), and Function Calling (tools/tool_calls) payloads.
// Note: For Function Calling we recommend using the chat-completion route
// (/api/pollinations/text/chat-completion) which is the canonical endpoint in this app.
export async function POST(req: Request) {
	let body: any;
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

	if (!body || !Array.isArray(body.messages)) {
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
			body: JSON.stringify(body),
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
