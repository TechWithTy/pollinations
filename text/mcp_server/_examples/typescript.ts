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
    console.log("All models (subset):", Array.isArray(allModels) ? (allModels as unknown[]).slice(0, 5) : allModels);

    // Text
    const textModels = await listTextModels();
    console.log("Text models (subset):", Array.isArray(textModels) ? (textModels as unknown[]).slice(0, 5) : textModels);

    // Image
    const imageModels = await listImageModels();
    console.log("Image models (subset):", Array.isArray(imageModels) ? (imageModels as unknown[]).slice(0, 5) : imageModels);

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
    console.log("Audio voices (subset):", Array.isArray(voices) ? (voices as unknown[]).slice(0, 5) : voices);

    const audioReply = await respondAudio({ prompt: "Hello from Pollinations MCP!", voice: "nova" });
    console.log("respondAudio:", audioReply ? Object.keys(audioReply) : null);

    const spoken = await sayText({ text: "Pollinations speaks clearly and verbatim.", voice: "alloy" });
    console.log("sayText:", spoken ? Object.keys(spoken) : null);

    // Demo flows
    const imageDemo = await demoImageFlow("A neon cyberpunk fox, 4k, highly detailed");
    console.log("Image demo result:", imageDemo);

    const audioDemo = await demoAudioFlow("Hello from Pollinations MCP!", "nova");
    console.log("Audio demo result:", audioDemo);
  } finally {
    await mcpClient.close();
  }
}
