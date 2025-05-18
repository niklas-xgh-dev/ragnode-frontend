<script>
  // 1) import the page store
  import { page } from '$app/state';

  // 2) grab your props
  let { bots, children } = $props();
</script>

<nav class="side-nav">
  <ul>
    <!-- now $page is valid -->
    <li>
      <a 
        href="/"
        class={{ active: $page.url.pathname === '/' }}
      >
        Home
      </a>
    </li>

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

<main>
  {@render children()}
</main>
