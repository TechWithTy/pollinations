// Health check for Pollinations proxy.
// We attempt a lightweight HEAD request to upstream to detect availability.
export const runtime = "edge";

export async function GET() {
	try {
		const res = await fetch("https://text.pollinations.ai/", {
			method: "HEAD",
			cache: "no-store",
		});
		if (!res.ok) {
			return new Response(
				JSON.stringify({ error: `Upstream status ${res.status}` }),
				{
					status: 502,
					headers: { "Content-Type": "application/json" },
				},
			);
		}
		return new Response(null, { status: 204 });
	} catch (e) {
		return new Response(JSON.stringify({ error: (e as Error).message }), {
			status: 502,
			headers: { "Content-Type": "application/json" },
		});
	}
}
