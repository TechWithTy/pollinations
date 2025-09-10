/**
 * 🌸 Pollinations Generative React Hooks – Advanced Examples
 * Optimized usage patterns for @pollinations/react hooks (text, image, chat)
 *
 * Install: npm install @pollinations/react
 * Docs/Playground: https://react-hooks.pollinations.ai/
 *
 * Notes
 * - These are TSX snippets you can paste into your components/pages.
 * - Patterns include memoization, graceful fallbacks, and minimal re-renders.
 */

export const advancedTextHookTsx = `import React, { useMemo } from "react";
import { usePollinationsText } from "@pollinations/react";

export function AdvancedHaiku({ topic = "Pollinations.AI" }: { topic?: string }) {
  // * Stable prompt via useMemo to avoid unnecessary regeneration
  const prompt = useMemo(() => \`Write a short haiku about \${topic}.\`, [topic]);

  const text = usePollinationsText(prompt, {
    seed: 42,           // ! Control determinism; set -1 to randomize
    model: "openai",    // * or "mistral"
    systemPrompt: "You are a poetic AI assistant.",
  });

  if (!text) return <p>Generating haiku…</p>;

  // * Render-only component avoids extra state changes
  return <p>{text}</p>;
};
`;

export const advancedImageHookTsx = `import React, { useMemo } from "react";
import { usePollinationsImage } from "@pollinations/react";

export function AdvancedImage({
  prompt = "A beautiful sunset over the ocean, ultrarealistic, 4k",
  width = 1024,
  height = 1024,
  model = "turbo",
  enhance = false,
  nologo = true,
  seed = 7,
}: {
  prompt?: string;
  width?: number;
  height?: number;
  model?: string;
  enhance?: boolean;
  nologo?: boolean;
  seed?: number;
}) {
  // * Freeze options with useMemo so URL is stable unless inputs change
  const options = useMemo(() => ({ width, height, model, enhance, nologo, seed }), [
    width,
    height,
    model,
    enhance,
    nologo,
    seed,
  ]);

  const imageUrl = usePollinationsImage(prompt, options);

  if (!imageUrl) return <p>Rendering image…</p>;

  return (
    <picture>
      <img
        src={imageUrl}
        alt={prompt}
        width={Math.min(width, 1024)}
        height={Math.min(height, 1024)}
        style={{ maxWidth: "100%", height: "auto", borderRadius: 8 }}
        loading="lazy"
        decoding="async"
      />
    </picture>
  );
}
`;

export const advancedChatHookTsx = `import React, { useCallback, useRef, useState } from "react";
import { usePollinationsChat } from "@pollinations/react";

export function AdvancedChat({
  model = "openai",
  seed = 42,
  jsonMode = false,
}: {
  model?: string;
  seed?: number;
  jsonMode?: boolean;
}) {
  const [input, setInput] = useState("");
  const listRef = useRef<HTMLDivElement | null>(null);

  const { sendUserMessage, messages } = usePollinationsChat(
    [{ role: "system", content: "You are a helpful assistant" }],
    { model, seed, jsonMode }
  );

  const handleSend = useCallback(() => {
    if (!input.trim()) return;
    // * Pass structured messages or plain string; here we send a string
    sendUserMessage({ role: "user", content: input.trim() });
    setInput("");
    // * Optional: scroll to bottom
    requestAnimationFrame(() => listRef.current?.scrollTo({ top: 999999, behavior: "smooth" }));
  }, [input, sendUserMessage]);

  return (
    <div style={{ display: "grid", gap: 8 }}>
      <div ref={listRef} style={{ maxHeight: 320, overflow: "auto", padding: 8, border: "1px solid #eee", borderRadius: 8 }}>
        {messages.map((m, i) => (
          <div key={i} style={{ marginBottom: 6 }}>
            <strong style={{ textTransform: "capitalize" }}>{m.role}:</strong> {String(m.content)}
          </div>
        ))}
      </div>
      <div style={{ display: "flex", gap: 8 }}>
        <input
          placeholder="Type your message"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          style={{ flex: 1 }}
        />
        <button onClick={handleSend}>Send</button>
      </div>
    </div>
  );
}
`;

export const pollinationsAdvancedHookExamples = {
	advancedTextHookTsx,
	advancedImageHookTsx,
	advancedChatHookTsx,
};
