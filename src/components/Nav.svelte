<script>
  import NavSection from './NavSection.svelte'
  import Logo from './Logo.svelte'

  export let logoSize, links

</script>

<div class="outer-container">
  <Logo size={logoSize} />
  <nav>
    <NavSection {links} />
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
    padding: 0 1rem;
    display: flex;
    flex-direction: column;
    /* max-width: 14rem; */
    width: 20rem;
  }
  ul {
    margin: 0;
    padding: 0;
    list-style: none;
  }

  :global(nav > ul > li > div) {
    color: white;
    padding: 0.5rem;
  }

  :global(nav div > h2) {
    font-size: 1.5rem;
    margin: 0;
  }

  :global(nav a:visited) {
    color: white;
  }


  :global(nav a[aria-current]) {
    border-bottom: 2px solid white;
  }

  .home, .featured {
    background-color: var(--second-darkest-hue)
  }

  .categories, .contact {
    background-color: var(--darkest-hue)
  }

  .contact {
    margin-bottom: 2rem;
  }

  .contact a {
    text-decoration: none;
    display: block;
  }

  /* a:visited {
    color: var(--second-darkest-hue);
  } */
  
/*
  .contact a:hover,
  .contact a:active {
      color: ?;
    } */
</style>
