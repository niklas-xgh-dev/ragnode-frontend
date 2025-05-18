<script>
  import Chat from '$lib/Chat.svelte';
  let { data } = $props();
  let { bot } = data;
  let baseUrl = `http://localhost:8000${bot.chat_path}`;
</script>

<h1>{bot.title}</h1>
<p>{bot.description}</p>

<Chat {baseUrl} />