<script>
  import { page } from '$app/state';
  let { bots, children } = $props();
</script>

<nav class="side-nav">
  <div class="nav-logo-container">
    <img src="/logo_v2.svg" alt="Ragnode Logo" class="nav-logo" />
  </div>
  <ul class="nav-links">
    <li><a href="/" class={{ active: $page.url.pathname === '/' }}>Home</a></li>
    {#each Object.entries(bots) as [botId, bot]}
      <li>
        <a
          href="/{botId}"
          class={{ active: $page.url.pathname === `/${botId}` }}
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
