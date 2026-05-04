<script>
  import LineLogo from "./logos/LineLogo.svelte";

  export let doubleBorder;
</script>

<style>
  header {
    display: flex;
    justify-content: space-between;
    gap: 1rem;
    padding: 0.5rem;
    border-bottom: 4px solid black;
  }

  header > div {
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .primary-header-txt {
    font-size: 2rem;
    font-weight: bold;
    font-style: italic;
    letter-spacing: 0.3rem;
  }

  .secondary-header-txt {
    font-style: italic;
    letter-spacing: 0.1rem;
  }

  main {
    box-shadow: inset 0 0 0 0.75rem var(--main-bg-color),
      inset 0 0 0 1.5rem black;
    -webkit-box-shadow: inset 0 0 0 0.75rem var(--main-bg-color),
      inset 0 0 0 1.5rem black;
    -moz-box-shadow: inset 0 0 0 0.75rem var(--main-bg-color)
       inset 0 0 0 1.5rem black;
    max-width: 1000px;
    padding: 2rem 4rem;
    width: 100%;
    margin-top: -.75rem;
  }

  main.doubleBorder {
    box-shadow: inset 0 0 0 0.75rem var(--main-bg-color), inset 0 0 0 1.5rem black,
      inset 0 0 0 2.25rem var(--main-bg-color), inset 0 0 0 3rem gray;
    -webkit-box-shadow: inset 0 0 0 0.75rem var(--main-bg-color), inset 0 0 0 1.5rem black,
      inset 0 0 0 2.25rem var(--main-bg-color), inset 0 0 0 3rem gray;
    -moz-box-shadow: inset 0 0 1.5rem var(--main-bg-color), inset 0 0 0 1.5rem black,
      inset 0 0 0 2.25rem var(--main-bg-color), inset 0 0 0 3rem gray;
    padding: 2.5rem 4rem;
  }

    @media (max-width: 600px) {
    main {
      padding: 2rem;
    }

    main.doubleBorder {
      padding: 3.5rem;
    }

    header {
      flex-wrap: wrap;
      justify-content: center;
      gap: 0.5rem;
    }

    .primary-header-txt {
      font-size: 1.3rem;
      letter-spacing: 0.1rem;
    }

    .secondary-header-txt {
      font-size: 0.85rem;
      letter-spacing: 0.05rem;
    }
  }
</style>

<main class:doubleBorder>
  <header>
    <LineLogo />

    <div>
      <div class="primary-header-txt">THE CLEAN AIR TEAM</div>
      <div class="secondary-header-txt">
        ALL-VOLUNTEER PUBLIC SERVICE SINCE 1975
      </div>
    </div>
  </header>
  <slot />
</main>
