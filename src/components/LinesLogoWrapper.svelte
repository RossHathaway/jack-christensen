<script>
  export let doubleBorder;
</script>

<style>
  main {
    border: 0.75rem solid black;
  }

  main.doubleBorder {
    /* inset box shadow */
  }
</style>

<header />

<main class:doubleBorder>
  <slot />
</main>
