<script>
  import NavSection from "./NavSection.svelte";
  import Logo from "./Logo.svelte";

  export let logoSize, links;

  const processedLinks = [];

  for (let link of links) {
    if (link.name === "About Uncle Jack") {
      processedLinks[0] = link;
    } else if (link.name === "Featured") {
      processedLinks[1] = link;
    } else if (link.name === "Content") {
      processedLinks[2] = link;
    } else if (link.name === "Contact") {
      processedLinks[3] = link;
    }
  }
</script>

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

  nav > div.about-uncle-jack,
  nav > div.featured {
    background-color: var(--second-darkest-hue);
  }

  nav > div.content,
  nav > div.contact {
    background-color: var(--darkest-hue);
  }
</style>

<div class="outer-container">
  <Logo size={logoSize} />
  <nav>
    {#each processedLinks as link}
      {#if link.name === 'About Uncle Jack'}
        <div class={link.path}>
          <a href="/">
            <h2>HOME</h2>
          </a>
          <NavSection links={link.children ? link.children : []} />
        </div>
      {:else if link.name === 'Featured'}
        <div class={link.path}>
          <a href="featured">
            <h2>{link.name}</h2>
          </a>
          <NavSection links={link.children ? link.children : []} />
        </div>
      {:else if link.name === 'Content'}
        <div class={link.path}>
          <a href="content">
            <h2>{link.name}</h2>
          </a>
          <NavSection
            hasLightBgColor={false}
            links={link.children ? link.children : []} />
        </div>
      {:else if link.name === 'Contact'}
        <div class={link.path}>
          <a href="contact">
            <h2>{link.name}</h2>
          </a>

        </div>
      {/if}
    {/each}

  </nav>
</div>
