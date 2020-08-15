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

  #menu-toggle {
    border: 0;
    clip: rect(0 0 0 0);
    height: 1px;
    width: 1px;
    margin: -1px;
    overflow: hidden;
    padding: 0;
    position: absolute;
  }

  label[for="menu-toggle"] {
    color: white;
    margin-bottom: 1rem;
    width: 18rem;
    padding: 0.75rem;
    display: flex;
    align-items: center;
    align-self: flex-start;

    transform-origin: left;
    transition: width 0.3s;
  }

  nav {
    font-weight: 300;

    display: flex;
    flex-direction: column;
    align-self: flex-start;

    width: 18rem;
    margin: 0 1rem;

    transition: transform 0.3s, width 0.5s;
  }

  #menu-toggle:checked ~ label[for="menu-toggle"] {
    width: 11rem;
    align-self: flex-start;
    margin-left: 1rem;
  }

  #menu-toggle:checked ~ label[for="menu-toggle"]::after {
    transform: rotate(0deg);
  }

  #menu-toggle:checked ~ nav {
    width: 0;
    overflow: hidden;
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

  <input type="checkbox" id="menu-toggle" />
  <label for="menu-toggle" onclick>
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 103.8 103.8"
      height="5rem">
      <g
        transform="translate(-79.8 -103.8)"
        fill="none"
        stroke="var(--second-darkest-hue)"
        stroke-width="9"
        stroke-linecap="round"
        stroke-linejoin="round">
        <rect ry="7.9" rx="7.9" y="107.1" x="83.1" height="97.2" width="97.2" />
        <path d="M95.8 182h71.9M95.8 131.1h71.9M95.8 156.6h71.9" />
      </g>
    </svg>
  </label>

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
          <h2>{link.name}</h2>
          <NavSection links={link.children ? link.children : []} />
        </div>
      {:else if link.name === 'Content'}
        <div class={link.path}>
          <h2>{link.name}</h2>
          <NavSection
            hasLightBgColor={false}
            links={link.children ? link.children : []} />
        </div>
      {:else if link.name === 'Contact'}
        <div class={link.path}>
          <h2>{link.name}</h2>

        </div>
      {/if}
    {/each}

  </nav>
</div>
