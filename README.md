# 🟣 Custom Svelte Chat Frontend

A beautiful, dark-themed, markdown/code-enabled chat UI built in **Svelte 5** with live streaming support, communicating with a **Gradio-based Python backend** via the official `@gradio/client` library.

---

## 🌟 Features

- **Modern chat UI:** Clean, mobile-friendly, dark-mode by default.
- **Markdown & code formatting:** Syntax-highlighted code blocks via [Marked](https://github.com/markedjs/marked) and [PrismJS](https://prismjs.com/).
- **Streaming responses:** See responses as they’re generated, just like ChatGPT.
- **Auto-scroll:** Always scrolls to the latest message.
- **Multi-bot support:** Easily connect to multiple endpoints (just configure `baseUrl`).
- **Full frontend control:** All UI/UX, theming, and history handled by Svelte; no Gradio UI is used.

---

## 🗂️ Directory Structure

Typical repo structure (SvelteKit/Svelte 5):

my-chat-frontend/
├── public/ # Static assets (favicons, logo, etc.)
├── src/
│ ├── lib/
│ │ └── Chat.svelte # Main chat UI component
│ ├── routes/
│ │ └── +page.svelte # Entry page rendering <Chat />
│ └── app.html # HTML shell
├── package.json
├── svelte.config.js
├── vite.config.js
└── README.md # (This file)

- `src/lib/Chat.svelte`: The main chat UI, fully custom, Svelte 5 runes API.
- `src/routes/+page.svelte`: The main app entry, usually just renders `<Chat />` (pass in baseUrl as a prop).
- `public/`: Static files (can contain your logo, favicon, etc.).
- `package.json`: All dependencies (see below).
- `svelte.config.js` / `vite.config.js`: SvelteKit & Vite config.

---