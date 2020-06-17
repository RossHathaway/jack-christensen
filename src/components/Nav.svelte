<script>
  import NavSection from './NavSection.svelte'
  import Logo from './Logo.svelte'

  export let logoSize, links
  console.log('links:', links)
</script>

<div class="outer-container">
  <Logo size={logoSize} />
  <nav>
    <!-- children: (2) [{…}, {…}]
lastUrlSegment: "about-uncle-jack"
name: "About Uncle Jack"
path: "about-uncle-jack" -->
  {#each links as link}
    {#if link.name === "Index"}
    <!-- no index page -->
    {:else}
      <div>
      {#if link.name === "About Uncle Jack"}
        <h3>HOME</h3>
      {:else}
        <h3>{link.name}</h3>
      {/if}
        <NavSection links={link.children ? link.children : []} />
      </div>
    {/if}
  {/each}

  </nav>
</div>


<style>

  .outer-container {
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  nav {
    font-weight: 300;
    display: flex;
    flex-direction: column;
    width: 20rem;
  }

  :global(nav a[aria-current]) {
    border-bottom: 2px solid white;
  }

</style>
