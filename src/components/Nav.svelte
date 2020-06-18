<script>
  import NavSection from './NavSection.svelte'
  import Logo from './Logo.svelte'

  export let logoSize, links

  console.log('links', links)

</script>

<!-- {path: "about-uncle-jack", name: "About Uncle Jack", lastUrlSegment: "about-uncle-jack", children: Array(2)}
1: {path: "categories", name: "Categories", lastUrlSegment: "categories", children: Array(17)}
2: {path: "contact", name: "Contact", lastUrlSegment: "contact", children: null}
3: {path: "featured-topics", name: "Featured Topics", lastUrlSegment: "featured-topics", children: Array(5)}
4: {path: "index", name: "Index",  -->

<div class="outer-container">
  <Logo size={logoSize} />
  <nav>
  {#each links as link}
    {#if link.name === "Index"}
    <!-- no index page -->
    {:else}
      <div class="{link.path}">
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

  nav > div {
    color: white;
  }

  nav > div.about-uncle-jack {
    background-color: var(--second-darkest-hue);
  }

  nav > div.featured-topics {
    background-color: var(--second-darkest-hue);
  }

  nav > div.categories {
    background-color: var(--darkest-hue);
  }

  nav > div.contact {
    background-color: var(--darkest-hue);
  }

</style>
