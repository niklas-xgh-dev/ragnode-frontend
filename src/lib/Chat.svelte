<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import { Client, type Job } from '@gradio/client';

  // props
  let { baseUrl } = $props<{ baseUrl: string }>();

  let messages = $state<{ sender: 'user' | 'bot'; text: string }[]>([]);
  let userInput = $state('');
  let currentJob = $state<Job | null>(null);
  let client: Awaited<ReturnType<typeof Client.connect>>;

  onMount(async () => {
    client = await Client.connect(baseUrl);
  });

  onDestroy(() => {
    currentJob?.cancel();
  });

  async function sendMessage() {
    const text = userInput.trim();
    if (!text) return;
    userInput = '';
    messages = [...messages, { sender: 'user', text }];

    currentJob = client.submit('/chat', { message: { text, files: [] } });
    let botText = '';

    currentJob.on('data', (partial) => {
      botText = Array.isArray(partial) ? partial.join('') : String(partial);
      upsertBotMessage(botText);
    });
    currentJob.on('status', (s) => {
      if (s.stage === 'complete' || s.stage === 'error') {
        currentJob = null;
      }
    });
  }

  function upsertBotMessage(text: string) {
    if (messages.at(-1)?.sender === 'bot') {
      messages[messages.length - 1].text = text;
      messages = [...messages];
    } else {
      messages = [...messages, { sender: 'bot', text }];
    }
  }
</script>

<div class="chat">
  {#each messages as m}
    <p class="msg {m.sender}">{m.text}</p>
  {/each}

  <input
    bind:value={userInput}
    placeholder="Ask something…"
    onkeydown={(e) => e.key === 'Enter' && sendMessage()}
  />
</div>

<style>
  .chat { max-width: 480px; margin: auto; }
  .msg.user { text-align: right; font-weight: 600; }
  .msg.bot  { text-align: left; color: #555; }
  input     { width: 100%; margin-top: .5rem; padding: .5rem; }
</style>
