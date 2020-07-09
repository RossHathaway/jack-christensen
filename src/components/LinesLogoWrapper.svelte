<script>
  export let doubleBorder;
</script>

<style>
  main {
    border: 0.75rem solid black;
    max-width: 1000px;
    padding: 2rem 4rem;
  }

  main.doubleBorder {
    box-shadow: inset 0 0 0 0.75rem var(--main-bg-color),
      inset 0 0 0 1.5rem gray;
    -webkit-box-shadow: inset 0 0 0 0.75rem var(--main-bg-color),
      inset 0 0 0 1.5rem gray;
    -moz-box-shadow: inset 0 0 0 0.75rem var(--main-bg-color),
      inset 0 0 0 1.5rem gray;
  }
</style>

<header />

<main class:doubleBorder>
  <slot />
</main>
