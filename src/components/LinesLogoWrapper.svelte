<script>
  import LineLogo from "./LineLogo.svelte";

  export let doubleBorder;
</script>

<style>
  header {
    display: flex;
    justify-content: space-between;
    padding: 0.5rem;
    border-bottom: 4px solid black;
  }

  header > div {
    display: flex;
    flex-direction: column;
  }

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

<main class:doubleBorder>
  <header>
    <LineLogo />

    <div>
      <div>THE CLEAN AIR TEAM</div>
      <div>ALL-VOLUNTEER PUBLIC SERVICE SINCE 1975</div>
    </div>
  </header>
  <slot />
</main>
