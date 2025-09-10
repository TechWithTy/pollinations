// Real-time Feeds (SSE) — Minimal, clean example
// Reads Image and Text feeds via the local proxy route using Server-Sent Events.

// biome-ignore assist/source/organizeImports: <explanation>
export async function readSse(url: string, onEvent: (json: unknown) => void) {
	const res = await fetch(url, { headers: { Accept: "text/event-stream" } });
	if (!res.body) throw new Error("No SSE body");

	const reader = res.body.getReader();
	const decoder = new TextDecoder();
	let buffer = "";

	for (;;) {
		const { done, value } = await reader.read();
		if (done) break;
		buffer += decoder.decode(value, { stream: true });

		// Split complete SSE message blocks by blank line
		for (;;) {
			const sepIdx = buffer.indexOf("\n\n");
			if (sepIdx === -1) break;

			const chunk = buffer.slice(0, sepIdx);
			buffer = buffer.slice(sepIdx + 2);

			const dataLine = chunk
				.split("\n")
				.map((l) => l.trim())
				.find((l) => l.startsWith("data:"));
			if (!dataLine) continue;

			const payload = dataLine.slice(5).trim();
			if (payload === "[DONE]") return;
			try {
				onEvent(JSON.parse(payload));
			} catch {
				// Ignore non-JSON keepalives
			}
		}
	}
}

export async function startImageFeed() {
	const url = "/api/pollinations/text/mcp_server%20copy%202?feed=image";
	await readSse(url, (evt) => console.log("image feed:", evt));
}

export async function startTextFeed() {
	const url = "/api/pollinations/text/mcp_server%20copy%202?feed=text";
	await readSse(url, (evt) => console.log("text feed:", evt));
}

// Usage (uncomment to run in a browser context):
// void startImageFeed();
// void startTextFeed();

export async function readImageFeed() {
	// Optional explicit referrer can be provided when needed
	const url =
		"/api/pollinations/text/mcp_server%20copy%202?feed=image&referrer=mywebapp.com";
	await readSse(url, (evt) => console.log("image feed:", evt));
}

export async function readTextFeed() {
	const url = "/api/pollinations/text/mcp_server%20copy%202?feed=text";
	await readSse(url, (evt) => console.log("text feed:", evt));
}

// Usage (uncomment to run in a browser context or adapt for Node stream consumption):
// void readImageFeed();
// void readTextFeed();

// Example: Using this project's MCP client to call ALL Pollinations MCP tools
// Run in a Node context (e.g., tsx/ts-node script) with env configured for MCP

import { mcpClient } from "@/lib/services/mcp/client/mcpClient";
import {
	listModels,
	listTextModels,
	listImageModels,
	listAudioVoices,
	generateImageUrl,
	generateImage,
	respondAudio,
	sayText,
	demoImageFlow,
	demoAudioFlow,
} from "@/lib/services/mcp/pollinations";

export async function runMcpPollinationsDemo() {
	await mcpClient.connect();
	try {
		const tools = await mcpClient.listTools();
		console.log("Available MCP tools:", tools);

		// General
		const allModels = await listModels();
		console.log(
			"All models (subset):",
			Array.isArray(allModels)
				? (allModels as unknown[]).slice(0, 5)
				: allModels,
		);

		// Text
		const textModels = await listTextModels();
		console.log(
			"Text models (subset):",
			Array.isArray(textModels)
				? (textModels as unknown[]).slice(0, 5)
				: textModels,
		);

		// Image
		const imageModels = await listImageModels();
		console.log(
			"Image models (subset):",
			Array.isArray(imageModels)
				? (imageModels as unknown[]).slice(0, 5)
				: imageModels,
		);

		const imgUrl = await generateImageUrl({
			prompt: "A neon cyberpunk fox, 4k, highly detailed",
			width: 768,
			height: 512,
		});
		console.log("generateImageUrl:", imgUrl);

		const imgB64 = await generateImage({
			prompt: "A cozy cabin in the woods at dusk, cinematic lighting",
			width: 768,
			height: 512,
		});
		console.log("generateImage (base64?) length:", imgB64?.base64?.length);

		// Audio
		const voices = await listAudioVoices();
		console.log(
			"Audio voices (subset):",
			Array.isArray(voices) ? (voices as unknown[]).slice(0, 5) : voices,
		);

		const audioReply = await respondAudio({
			prompt: "Hello from Pollinations MCP!",
			voice: "nova",
		});
		console.log("respondAudio:", audioReply ? Object.keys(audioReply) : null);

		const spoken = await sayText({
			text: "Pollinations speaks clearly and verbatim.",
			voice: "alloy",
		});
		console.log("sayText:", spoken ? Object.keys(spoken) : null);

		// Demo flows
		const imageDemo = await demoImageFlow(
			"A neon cyberpunk fox, 4k, highly detailed",
		);
		console.log("Image demo result:", imageDemo);

		const audioDemo = await demoAudioFlow(
			"Hello from Pollinations MCP!",
			"nova",
		);
		console.log("Audio demo result:", audioDemo);
	} finally {
		await mcpClient.close();
	}
}
