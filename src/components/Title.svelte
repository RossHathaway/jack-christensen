<script>
  import Logo from "./Logo.svelte";

  export let logoSize;
</script>

<style>
  header {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: var(--height);
  }

  h1 {
    margin: 0;
    /* height: 100%; will this look better on mobile?*/
    width: 100%;
  }

  svg {
    max-width: 800px;
    min-width: 300px;
  }

  svg > text {
    font-size: 50px;
    font-weight: bold;
  }
</style>

<header>
  <Logo size={logoSize} />
  <h1>
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 180">

      <text x="110" y="110">Jack Shields Christensen</text>

    </svg>
  </h1>
</header>
