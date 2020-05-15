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
    display: flex;
    flex-direction: column;
    width: 20rem;
  }

  :global(nav a[aria-current]) {
    border-bottom: 2px solid white;
  }

</style>
