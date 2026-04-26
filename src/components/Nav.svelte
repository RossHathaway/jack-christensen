<script>
  import { onMount } from "svelte";
  import { stores } from "@sapper/app";
  import NavSection from "./NavSection.svelte";

  export let links;

  const { page } = stores();
  let menuToggle;

  onMount(() => {
    let prevPath = $page.path;
    return page.subscribe(($p) => {
      if ($p.path !== prevPath) {
        menuToggle.checked = false;
        // prevPath = $p.path;
      }
    });
  });

  const processedLinks = [];

  for (let link of links) {
    if (link.name === "About Uncle Jack") {
      processedLinks[0] = link;
    } else if (link.name === "Featured") {
      processedLinks[1] = link;
    } else if (link.name === "Contents") {
      processedLinks[2] = link;
    } else if (link.name === "Contact") {
      processedLinks[3] = link;
    }
  }
</script>

<style>
  #nav-container {
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
    display: none;
  }

  label[for="menu-toggle"] {
    background-color: var(--main-bg-color);
    align-self: flex-start;
    height: 55px;
    display: none;
  }

  nav {
    font-weight: 300;

    display: flex;
    flex-direction: column;
    align-self: flex-start;

    width: 18rem;
    margin: 0 1rem;

    transition: width 0.3s;
  }

  a {
    text-decoration: none;
  }

  h2 {
    margin: 0;
    font-size: 1.5rem;
  }

  :global(nav a[aria-current]) {
    text-decoration: underline;
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

  nav > div.contents,
  nav > div.contact {
    background-color: var(--darkest-hue);
  }

  @media (max-width: 1000px) {
    #nav-container {
      justify-content: center;
      align-items: center;
    }

    label[for="menu-toggle"],
    #menu-toggle {
      display: block;
    }

    nav {
      width: 0;
      height: 0;
      overflow: hidden;

      position: absolute;
      top: calc(7vw + 60px);
      right: 0;
      z-index: 3;
    }

    #menu-toggle:checked ~ nav {
      margin: 0 1rem;
      width: 18rem;
      height: auto;
      max-width: 18rem;
      max-height: auto;
    }
  }
</style>

<div id="nav-container">

  <input type="checkbox" id="menu-toggle" bind:this={menuToggle} />
  <label for="menu-toggle" onclick>
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      height="55px"
      fill="var(--second-darkest-hue)">
      <path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z"/>
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
      {:else if link.name === 'Contents'}
        <div class={link.path}>
          <h2>{link.name}</h2>
          <NavSection
            hasLightBgColor={false}
            links={link.children ? link.children : []} />
        </div>
      {:else if link.name === 'Contact'}
        <div class={link.path}>
          <a href="/contact">
            <h2>{link.name}</h2>
          </a>
        </div>
      {/if}
    {/each}

  </nav>
</div>
