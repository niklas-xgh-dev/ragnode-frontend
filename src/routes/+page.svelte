<script>
  // step 1: grab the data prop
  let { data } = $props();
  // step 2: pull bots out of that
  let { bots } = data;
</script>

<div class="welcome-container">
  <h1>Welcome to Ragnode</h1>
</div>

<div class="expert-grid">
  {#each Object.entries(bots) as [botId, bot]}
    <a href="/{botId}" class="expert-card">
      <h2>{bot.title}</h2>
      <p>{bot.description}</p>
    </a>
  {/each}
</div>