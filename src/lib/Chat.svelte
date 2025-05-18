<script lang="ts">
  import { Client } from '@gradio/client';
  import { marked } from 'marked';
  import Prism from 'prismjs';
  import 'prismjs/themes/prism-tomorrow.css';

  let { baseUrl } = $props<{ baseUrl: string }>();
  let userInput = $state('');
  let history = $state([]);
  let messages = $state<{ sender: 'user' | 'bot'; text: string }[]>([]);

  let client;
  let messagesEnd: HTMLDivElement | null = null;
  let inputElem: HTMLTextAreaElement | null = null;

  marked.setOptions({
    highlight: function (code, lang) {
      if (Prism.languages[lang]) {
        return Prism.highlight(code, Prism.languages[lang], lang);
      }
      return code;
    },
    breaks: true,
    gfm: true
  });

  $effect(() => {
    messagesEnd?.scrollIntoView({ behavior: 'smooth' });
  });

  $effect(async () => {
    client = await Client.connect(baseUrl);
  });

  async function sendMessage() {
    const text = userInput.trim();
    if (!text) return;
    userInput = '';
    messages = [...messages, { sender: 'user', text }];

    // 1. Call /user_3 with [text, history]
    const jobUser = await client.submit('/user_3', [text, history]);
    const { value: userRes } = await jobUser.next();
    let updatedHistory = userRes[1] || userRes.data?.[1];
    if (!updatedHistory) {
      updatedHistory = [...history, { role: "user", content: text }];
    }

    // 2. Call /bot_3 with [updatedHistory]
    const jobBot = await client.submit('/bot_3', [updatedHistory]);
    let botMsg = '';
    for await (const res of jobBot) {
      let streamedHistory = res[0] || res.data?.[0];
      if (!Array.isArray(streamedHistory)) continue;
      const last = streamedHistory[streamedHistory.length - 1];
      if (last && last.role === "assistant" && last.content !== undefined) {
        botMsg = last.content;
        upsertBotMessage(botMsg);
      }
      history = streamedHistory;
    }
  }

  function upsertBotMessage(text: string) {
    if (messages.at(-1)?.sender === 'bot') {
      messages[messages.length - 1].text = text;
      messages = [...messages];
    } else {
      messages = [...messages, { sender: 'bot', text }];
    }
  }

  // Post-process markdown for Prism highlighting and copyable code
  function renderMarkdown(text: string) {
    // marked will call Prism's highlight above
    const html = marked.parse(text || '');
    // Optionally, auto-copy button for code blocks
    return html.replace(
      /<pre><code class="language-([^"]*)">([\s\S]*?)<\/code><\/pre>/g,
      (match, lang, code) =>
        `<div class="code-block-wrap">
          <button class="copy-btn" onclick="navigator.clipboard.writeText(decodeHTMLEntities(\`${code}\`))" title="Copy code">📋</button>
          <pre><code class="language-${lang}">${code}</code></pre>
        </div>`
    );
  }

  // Fix for copy button (since it is injected as HTML, we must make the helper global)
  // Place this helper on window so copy buttons can use it:
  if (typeof window !== "undefined") {
    (window as any).decodeHTMLEntities = (text: string) => {
      const txt = document.createElement('textarea');
      txt.innerHTML = text;
      return txt.value;
    };
  }

  function handleInputKeydown(e: KeyboardEvent) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
    // Else allow multi-line entry (Shift+Enter or resize)
  }
</script>

<div id="chat-container" class="chatbox">
  <div class="messages">
    {#each messages as m}
      <div class="msg-row {m.sender}">
        <div
          class={{'msg-bubble': true, bot: m.sender === 'bot', user: m.sender === 'user'}}
          tabindex="0"
        >
          {@html renderMarkdown(m.text)}
        </div>
      </div>
    {/each}
    <div bind:this={messagesEnd}></div>
  </div>

  <div class="input-row">
    <textarea
      class="input"
      bind:value={userInput}
      bind:this={inputElem}
      placeholder="Ask something…"
      autocomplete="off"
      rows="1"
      style="resize: vertical; min-height: 44px; max-height: 200px;"
      onkeydown={handleInputKeydown}
      aria-label="Type your message (Shift+Enter for newline)"
    />
    <button class="send-btn" onclick={sendMessage} aria-label="Send message">Send</button>
  </div>
</div>

<style>
  .chatbox {
    max-width: 1140px;
    width: 100%;
    height: 80vh;
    min-height: 520px;
    margin: 48px auto 0 auto;
    background: rgb(23, 23, 25);
    border-radius: 0.5rem;
    border: 1px solid #2d3748;
    display: flex;
    flex-direction: column;
    padding: 0 0 0.75rem 0;
    font-family: 'Source Sans Pro', ui-sans-serif, system-ui, sans-serif;
    color: #f3f4f6;
    box-shadow: 0 6px 32px 0 rgba(0,0,0,0.14), 0 1.5px 6px 0 rgba(0,0,0,0.05);
    overflow: hidden;
  }

  .messages {
    flex: 1;
    overflow-y: auto;
    padding: 2rem 2rem 1rem 2rem;
    margin-bottom: 0.5rem;
    background: transparent;
    scrollbar-width: thin;
    scrollbar-color: #6366f1 #232324;
  }

  .msg-row {
    display: flex;
    margin-bottom: 16px;
    align-items: flex-end;
  }
  .msg-row.user {
    justify-content: flex-end;
  }
  .msg-row.bot {
    justify-content: flex-start;
  }

  .msg-bubble {
    padding: 14px 22px;
    border-radius: 18px;
    max-width: 95%;
    line-height: 1.6;
    font-size: 1.07rem;
    box-shadow: 0 2px 10px rgba(0,0,0,0.08);
    border: 1px solid #27272a;
    transition: background 0.18s;
    position: relative;
    font-family: inherit;
    word-break: break-word;
  }

  .msg-row.user .msg-bubble {
    background: linear-gradient(90deg, #818cf8 0%, #6366f1 100%);
    color: #fff;
    border-bottom-right-radius: 5px;
    border: none;
  }
  .msg-row.bot .msg-bubble {
    background: #232324;
    color: #f3f4f6;
    border-bottom-left-radius: 5px;
    border: 1px solid #323248;
  }

  /* PrismJS for code blocks in markdown */
  .msg-bubble pre, .msg-bubble code {
    font-family: 'JetBrains Mono', 'Fira Mono', 'Consolas', monospace;
    font-size: 0.97rem;
    background: #18181b !important;
    color: #cdd9e5;
    border-radius: 6px;
    padding: 0.5em 0.7em;
    line-height: 1.5;
    overflow-x: auto;
    white-space: pre;
    word-break: normal;
  }

  .msg-bubble pre {
    margin: 0.6em 0;
    padding: 1em 1.2em;
    background: #18181b !important;
    color: #d1d5db;
    overflow-x: auto;
    white-space: pre;
    word-break: normal;
    max-width: 100%;
  }

  .msg-bubble code {
    padding: 0.15em 0.36em;
    font-size: 0.99em;
    border-radius: 4px;
    background: #18181b;
    white-space: pre;
    word-break: normal;
  }

  /* Code block wrapper for copy button */
  .code-block-wrap {
    position: relative;
    margin: 0.6em 0;
  }
  .copy-btn {
    position: absolute;
    top: 0.6em;
    right: 1em;
    z-index: 5;
    font-size: 1rem;
    background: #2d2d2f;
    color: #fff;
    border: none;
    border-radius: 6px;
    padding: 3px 10px;
    opacity: 0.75;
    cursor: pointer;
    transition: opacity 0.15s;
  }
  .copy-btn:hover {
    opacity: 1;
    background: #6366f1;
    color: #fff;
  }

  .input-row {
    display: flex;
    gap: 12px;
    align-items: flex-end;
    margin-top: 0;
    padding: 0.75rem 1.5rem 0.75rem 1.5rem;
    border-top: 1px solid #2d3748;
    background: none;
    min-height: 65px;
  }

  .input {
    flex: 1;
    border: none;
    border-radius: 14px;
    padding: 13px 16px;
    background: #18181b;
    font-size: 1.07rem;
    color: #f3f4f6;
    transition: box-shadow 0.18s;
    outline: none;
    box-shadow: 0 0 0 1.5px #333c50 inset;
    resize: vertical;
    min-height: 44px;
    max-height: 200px;
  }
  .input:focus {
    box-shadow: 0 0 0 2px #6366f1;
    background: #18181b;
  }

  .send-btn {
    background: linear-gradient(90deg, #818cf8 0%, #6366f1 100%);
    color: #fff;
    border: none;
    border-radius: 14px;
    padding: 12px 28px 12px 22px;
    font-size: 1rem;
    font-weight: 600;
    cursor: pointer;
    box-shadow: 0 1.5px 6px 0 rgba(99,102,241,0.13);
    transition: background 0.18s, box-shadow 0.14s;
  }
  .send-btn:hover, .send-btn:focus {
    background: linear-gradient(90deg, #6366f1 0%, #818cf8 100%);
    box-shadow: 0 3px 12px 0 rgba(99,102,241,0.18);
    outline: none;
  }

  .messages::-webkit-scrollbar {
    width: 7px;
    background: #18181b;
  }
  .messages::-webkit-scrollbar-thumb {
    background: #2d3748;
    border-radius: 3px;
  }
</style>
