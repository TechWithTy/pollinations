import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { POST } from "../route";

// Auth proxy route under test
const URL = "http://localhost/api/pollinations/text/auth";

function makeRequest(body: unknown) {
	return new Request(URL, {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(body),
	});
}

describe("Function Calling (chat-completion) route", () => {
	const originalFetch = global.fetch;

	beforeEach(() => {
		vi.useFakeTimers();
	});

	afterEach(() => {
		vi.useRealTimers();
		global.fetch = originalFetch;
		vi.restoreAllMocks();
	});

	it("returns 400 on invalid JSON body", async () => {
		global.fetch = vi.fn();
		const req = makeRequest({ foo: "bar" });
		const res = await POST(req);
		expect(res.status).toBe(400);
		const json = await res.json();
		expect(json.error).toBeDefined();
	});

	it("proxies success JSON with tools payload", async () => {
		const upstreamJson = {
			id: "x",
			choices: [{ message: { role: "assistant", content: "ok" } }],
		};
		global.fetch = vi.fn().mockResolvedValue(
			new Response(JSON.stringify(upstreamJson), {
				status: 200,
				headers: { "Content-Type": "application/json" },
			}),
		);

		const body = {
			model: "openai",
			messages: [{ role: "user", content: "What is the weather in Boston?" }],
			tools: [
				{
					type: "function",
					function: {
						name: "get_current_weather",
						description: "Get weather",
						parameters: {
							type: "object",
							properties: { location: { type: "string" } },
							required: ["location"],
						},
					},
				},
			],
			tool_choice: "auto",
		};
		const req = makeRequest(body);
		const res = await POST(req);
		expect(res.status).toBe(200);
		const text = await res.text();
		expect(text).toContain("ok");
	});

	it("bubbles upstream error", async () => {
		global.fetch = vi
			.fn()
			.mockResolvedValue(new Response("bad upstream", { status: 502 }));
		const req = makeRequest({ model: "openai", messages: [] });
		const res = await POST(req);
		expect(res.status).toBe(502);
		const body = await res.text();
		expect(body).toContain("bad upstream");
	});

	it("forwards Authorization header to upstream", async () => {
		const upstreamJson = { id: "ok", choices: [{ message: { role: "assistant", content: "auth" } }] };
		const mockFetch = vi.fn().mockImplementation((_url: string, init?: RequestInit) => {
			// Assert header was forwarded
			expect(init?.headers && (init.headers as Record<string, string>)["Authorization"]).toBe("Bearer TEST_TOKEN");
			return Promise.resolve(
				new Response(JSON.stringify(upstreamJson), {
					status: 200,
					headers: { "Content-Type": "application/json" },
				}),
			);
		});
		global.fetch = mockFetch as unknown as typeof fetch;

		const req = new Request(URL, {
			method: "POST",
			headers: { "Content-Type": "application/json", Authorization: "Bearer TEST_TOKEN" },
			body: JSON.stringify({ model: "openai", messages: [{ role: "user", content: "hello" }] }),
		});
		const res = await POST(req);
		expect(res.status).toBe(200);
		const txt = await res.text();
		expect(txt).toContain("auth");
	});

	it("appends referrer param to upstream URL", async () => {
		const upstreamJson = { id: "ok", choices: [{ message: { role: "assistant", content: "ref" } }] };
		const mockFetch = vi.fn().mockImplementation((url: string) => {
			// Assert referrer is included in forwarded URL
			expect(url).toContain("referrer=mywebapp.com");
			return Promise.resolve(
				new Response(JSON.stringify(upstreamJson), {
					status: 200,
					headers: { "Content-Type": "application/json" },
				}),
			);
		});
		global.fetch = mockFetch as unknown as typeof fetch;

		const req = new Request(`${URL}?referrer=mywebapp.com`, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ model: "openai", messages: [{ role: "user", content: "hello" }] }),
		});
		const res = await POST(req);
		expect(res.status).toBe(200);
		const txt = await res.text();
		expect(txt).toContain("ref");
	});
});
