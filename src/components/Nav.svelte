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
    {:else if link.name === "About Uncle Jack"}
      <div class="{link.path}">
        <a href="/"><h2>HOME</h2></a>
        <NavSection links={link.children ? link.children : []} />
      </div>
      {:else if link.name === "Featured Topics"}
        <div class="{link.path}">
          <a href="featured-topics"><h2>{link.name}</h2></a>
          <NavSection links={link.children ? link.children : []} />
        </div>
        {:else if link.name === "Categories"}
        <div class="{link.path}">
          <a href="categories"><h2>{link.name}</h2></a>
          <NavSection hasLightBgColor={false} links={link.children ? link.children : []} />
        </div>
        {:else if link.name === "Contact"}
        <div class="{link.path}">
          <a href="contact"><h2>{link.name}</h2></a>
          
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
    margin: 0 1rem;
  }

  a {
    text-decoration: none;
  }

  h2 {
    margin: 0;
    font-size: 1.5rem;
  }

  :global(nav a[aria-current]) {
    border-bottom: 2px solid white;
  }

  nav > div {
    color: white;
    margin-bottom: 1rem;
    padding: 0.5rem;
  }

  nav > div.about-uncle-jack, nav > div.featured-topics {
    background-color: var(--second-darkest-hue);
  }

  nav > div.categories, nav > div.contact {
    background-color: var(--darkest-hue);
  }

</style>
