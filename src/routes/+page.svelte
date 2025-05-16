<script>
  let { bots } = $props().data;
</script>

<h1>Welcome to Ragnode</h1>
<div class="grid">
  {#each Object.entries(bots) as [botId, bot]}
    <a href="/{botId}" class="card">
      <h2>{bot.title}</h2>
      <p>{bot.description}</p>
    </a>
  {/each}
</div>
