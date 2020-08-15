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
    background-color: var(--second-darkest-hue);
    color: white;
    margin-bottom: 1rem;
    width: 18rem;
    padding: 0.75rem;
    display: flex;
    align-items: center;

    transform-origin: left;
    transition: width 0.3s;
  }

  label[for="menu-toggle"]::after {
    content: "";
    display: inline-block;
    padding: 0.25rem;
    margin-left: auto;

    background-image: url("/logos/line-arrow.svg");
    background-repeat: no-repeat;
    background-position: center;
    background-origin: content-box;

    transform: rotate(180deg);
    transition: transform 0.3s;

    height: 2rem;
    width: 2rem;

    outline: none;
  }

  #menu-toggle ~ label[for="menu-toggle"] #hide {
    display: inline;
  }

  #menu-toggle ~ label[for="menu-toggle"] #show {
    display: none;
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

  #menu-toggle:checked ~ label[for="menu-toggle"] #hide {
    display: none;
  }

  #menu-toggle:checked ~ label[for="menu-toggle"] #show {
    display: inline;
  }

  #menu-toggle:checked ~ nav {
    width: 0;
    overflow: hidden;
    /* transform: translateX(-150%); */
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
    <span id="hide">Hide Menu</span>
    <span id="show">Show Menu</span>
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
