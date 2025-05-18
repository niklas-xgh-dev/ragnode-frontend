<script>
  // get bots and children from props
  let { bots = {}, children } = $props();
</script>

<nav class="side-nav">
  <div class="nav-logo-container">
    <img src="/logo_v2.svg" alt="Ragnode Logo" class="nav-logo" />
  </div>
  <ul class="nav-links">
    <li>
      <a href="/" class="nav-item">Home</a>
    </li>
    {#each Object.entries(bots) as [botId, bot]}
      <li>
        <a
          href="/{botId}-chat"
          class="nav-item"
        >
          {bot.title}
        </a>
      </li>
    {/each}
  </ul>
</nav>
<main class="main-content">
  {@render children()}
</main>
