<script>
  import Chat from '$lib/Chat.svelte';
  let { data } = $props();
  let { bot } = data;
</script>

<h1>{bot.title}</h1>
<p>{bot.description}</p>

<Chat baseUrl={bot.chat_path} />